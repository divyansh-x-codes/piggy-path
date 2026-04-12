const { prisma } = require('../prisma/client');

/**
 * The Matching Engine — core trading logic
 *
 * Rules:
 * - BUY orders match against the lowest-priced SELL orders
 * - SELL orders match against the highest-priced BUY orders
 * - Price is determined by the resting order (maker's price)
 * - On every match: balances update, holdings update, price history inserted
 */

class MatchingEngine {
  constructor(io) {
    this.io = io; // Socket.io instance for real-time events
  }

  /**
   * Place a new BUY order and attempt to match it
   */
  async buy({ userId, stockId, price, quantity }) {
    // Validate: sufficient balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const totalCost = price * quantity;

    if (user.balance < totalCost) {
      throw new Error(`Insufficient balance. Required: ₹${totalCost.toFixed(2)}, Available: ₹${user.balance.toFixed(2)}`);
    }

    // Create the BUY order
    const order = await prisma.order.create({
      data: {
        userId,
        stockId,
        type: 'BUY',
        price,
        quantity,
        filled: 0,
        status: 'OPEN',
      },
    });

    // Try to match
    const matches = await this._matchBuyOrder(order);
    return { order, matches };
  }

  /**
   * Place a new SELL order and attempt to match it
   */
  async sell({ userId, stockId, price, quantity }) {
    // Validate: user owns enough shares
    const holding = await prisma.holding.findUnique({
      where: { userId_stockId: { userId, stockId } },
    });

    if (!holding || holding.quantity < quantity) {
      const owned = holding?.quantity ?? 0;
      throw new Error(`Insufficient holdings. Trying to sell ${quantity}, but only own ${owned}`);
    }

    // Create the SELL order
    const order = await prisma.order.create({
      data: {
        userId,
        stockId,
        type: 'SELL',
        price,
        quantity,
        filled: 0,
        status: 'OPEN',
      },
    });

    // Try to match
    const matches = await this._matchSellOrder(order);
    return { order, matches };
  }

  /**
   * Match a BUY order against the most competitive (lowest price) SELL orders
   */
  async _matchBuyOrder(buyOrder) {
    const matches = [];
    let remainingQty = buyOrder.quantity - buyOrder.filled;

    while (remainingQty > 0) {
      // Find the best (lowest price) SELL order we can afford
      const sellOrder = await prisma.order.findFirst({
        where: {
          stockId: buyOrder.stockId,
          type: 'SELL',
          status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
          price: { lte: buyOrder.price },
          userId: { not: buyOrder.userId }, // Can't trade with yourself
        },
        orderBy: [{ price: 'asc' }, { createdAt: 'asc' }],
      });

      if (!sellOrder) break; // No match found

      const fillQty = Math.min(remainingQty, sellOrder.quantity - sellOrder.filled);
      const fillPrice = sellOrder.price; // Maker price

      // Execute the transaction atomically
      const txn = await this._executeTransaction({
        buyOrder,
        sellOrder,
        fillQty,
        fillPrice,
      });

      matches.push(txn);
      remainingQty -= fillQty;
    }

    // Update the buy order status
    const totalFilled = buyOrder.quantity - remainingQty;
    await prisma.order.update({
      where: { id: buyOrder.id },
      data: {
        filled: totalFilled,
        status: remainingQty === 0 ? 'COMPLETED' : totalFilled > 0 ? 'PARTIALLY_FILLED' : 'OPEN',
      },
    });

    return matches;
  }

  /**
   * Match a SELL order against the most competitive (highest price) BUY orders
   */
  async _matchSellOrder(sellOrder) {
    const matches = [];
    let remainingQty = sellOrder.quantity - sellOrder.filled;

    while (remainingQty > 0) {
      // Find the best (highest price) BUY order
      const buyOrder = await prisma.order.findFirst({
        where: {
          stockId: sellOrder.stockId,
          type: 'BUY',
          status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
          price: { gte: sellOrder.price },
          userId: { not: sellOrder.userId },
        },
        orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
      });

      if (!buyOrder) break;

      const fillQty = Math.min(remainingQty, buyOrder.quantity - buyOrder.filled);
      const fillPrice = buyOrder.price; // Maker price

      const txn = await this._executeTransaction({
        buyOrder,
        sellOrder,
        fillQty,
        fillPrice,
      });

      matches.push(txn);
      remainingQty -= fillQty;
    }

    // Update sell order status
    const totalFilled = sellOrder.quantity - remainingQty;
    await prisma.order.update({
      where: { id: sellOrder.id },
      data: {
        filled: totalFilled,
        status: remainingQty === 0 ? 'COMPLETED' : totalFilled > 0 ? 'PARTIALLY_FILLED' : 'OPEN',
      },
    });

    return matches;
  }

  /**
   * Execute a single trade between a buyer and seller atomically
   */
  async _executeTransaction({ buyOrder, sellOrder, fillQty, fillPrice }) {
    const totalValue = fillPrice * fillQty;

    // Run everything in a Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct buyer's balance
      await tx.user.update({
        where: { id: buyOrder.userId },
        data: { balance: { decrement: totalValue } },
      });

      // 2. Credit seller's balance
      await tx.user.update({
        where: { id: sellOrder.userId },
        data: { balance: { increment: totalValue } },
      });

      // 3. Update buyer's holding
      await this._updateHolding(tx, buyOrder.userId, buyOrder.stockId, fillQty, fillPrice, 'buy');

      // 4. Update seller's holding
      await this._updateHolding(tx, sellOrder.userId, sellOrder.stockId, fillQty, fillPrice, 'sell');

      // 5. Update the sell order's filled count
      const newSellFilled = sellOrder.filled + fillQty;
      await tx.order.update({
        where: { id: sellOrder.id },
        data: {
          filled: newSellFilled,
          status: newSellFilled >= sellOrder.quantity ? 'COMPLETED' : 'PARTIALLY_FILLED',
        },
      });

      // 6. Update stock's current price
      const updatedStock = await tx.stock.update({
        where: { id: buyOrder.stockId },
        data: { currentPrice: fillPrice },
      });

      // 7. Insert price history record
      await tx.priceHistory.create({
        data: {
          stockId: buyOrder.stockId,
          price: fillPrice,
        },
      });

      // 8. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          buyerId: buyOrder.userId,
          sellerId: sellOrder.userId,
          stockId: buyOrder.stockId,
          price: fillPrice,
          quantity: fillQty,
        },
      });

      return { transaction, updatedStock };
    });

      // 9. Emit real-time price update to everyone
      this.io.emit('price_update', {
        stockId: buyOrder.stockId,
        price: result.updatedStock.currentPrice,
        symbol: result.updatedStock.symbol,
        time: new Date().toISOString(),
        quantity: fillQty,
      });

      // 10. Emit private profile update to buyer and seller
      this.io.to(`user:${buyOrder.userId}`).emit('profile_updated');
      this.io.to(`user:${sellOrder.userId}`).emit('profile_updated');

    console.log(`[Trade] ${fillQty} units of ${buyOrder.stockId} @ ₹${fillPrice}`);
    return result.transaction;
  }

  /**
   * Update a user's holding position (buy = add, sell = subtract)
   */
  async _updateHolding(tx, userId, stockId, qty, price, direction) {
    const existing = await tx.holding.findUnique({
      where: { userId_stockId: { userId, stockId } },
    });

    if (direction === 'buy') {
      if (!existing) {
        await tx.holding.create({
          data: { userId, stockId, quantity: qty, avgPrice: price },
        });
      } else {
        const totalQty = existing.quantity + qty;
        const newAvgPrice = (existing.avgPrice * existing.quantity + price * qty) / totalQty;
        await tx.holding.update({
          where: { userId_stockId: { userId, stockId } },
          data: { quantity: totalQty, avgPrice: newAvgPrice },
        });
      }
    } else {
      // Sell
      if (existing) {
        const newQty = existing.quantity - qty;
        if (newQty <= 0) {
          await tx.holding.delete({ where: { userId_stockId: { userId, stockId } } });
        } else {
          await tx.holding.update({
            where: { userId_stockId: { userId, stockId } },
            data: { quantity: newQty },
          });
        }
      }
    }
  }
}

module.exports = MatchingEngine;
