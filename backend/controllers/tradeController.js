const { prisma } = require('../prisma/client');

/**
 * Trade controller — handles buy/sell requests
 * The matching engine instance is injected at route registration time
 */

// POST /buy
const placeBuyOrder = (engine) => async (req, res) => {
  try {
    const { stockId, price, quantity } = req.body;
    const userId = req.user.dbUser.id;

    // Input validation
    if (!stockId || !price || !quantity) {
      return res.status(400).json({ error: 'stockId, price, and quantity are required' });
    }
    if (price <= 0 || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'price must be > 0 and quantity must be a positive integer' });
    }

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const { order, matches } = await engine.buy({ userId, stockId, price, quantity });

    res.json({
      success: true,
      order,
      matchedTrades: matches.length,
      message: matches.length > 0
        ? `Order placed and matched ${matches.length} trade(s)`
        : 'Order placed and added to order book (waiting for match)',
    });
  } catch (err) {
    console.error('[TradeController] buy error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// POST /sell
const placeSellOrder = (engine) => async (req, res) => {
  try {
    const { stockId, price, quantity } = req.body;
    const userId = req.user.dbUser.id;

    if (!stockId || !price || !quantity) {
      return res.status(400).json({ error: 'stockId, price, and quantity are required' });
    }
    if (price <= 0 || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'price must be > 0 and quantity must be a positive integer' });
    }

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const { order, matches } = await engine.sell({ userId, stockId, price, quantity });

    res.json({
      success: true,
      order,
      matchedTrades: matches.length,
      message: matches.length > 0
        ? `Order placed and matched ${matches.length} trade(s)`
        : 'Sell order placed and added to order book (waiting for match)',
    });
  } catch (err) {
    console.error('[TradeController] sell error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// GET /orders — user's order history
const getOrders = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { status, type, stockId } = req.query;

    const where = { userId };
    if (status) where.status = status;
    if (type) where.type = type;
    if (stockId) where.stockId = stockId;

    const orders = await prisma.order.findMany({
      where,
      include: { stock: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(orders.map((o) => ({
      id: o.id,
      type: o.type,
      status: o.status,
      price: o.price,
      quantity: o.quantity,
      filled: o.filled,
      remaining: o.quantity - o.filled,
      stockId: o.stockId,
      symbol: o.stock.symbol,
      stockName: o.stock.name,
      createdAt: o.createdAt,
    })));
  } catch (err) {
    console.error('[TradeController] getOrders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// GET /transactions — user's executed trades
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: { stock: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(transactions.map((t) => ({
      id: t.id,
      role: t.buyerId === userId ? 'buyer' : 'seller',
      stockId: t.stockId,
      symbol: t.stock.symbol,
      stockName: t.stock.name,
      price: t.price,
      quantity: t.quantity,
      total: t.price * t.quantity,
      createdAt: t.createdAt,
    })));
  } catch (err) {
    console.error('[TradeController] getTransactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// DELETE /orders/:id — cancel an open order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Not your order' });
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      return res.status(400).json({ error: `Cannot cancel a ${order.status} order` });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({ success: true, order: updated });
  } catch (err) {
    console.error('[TradeController] cancelOrder error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

module.exports = { placeBuyOrder, placeSellOrder, getOrders, getTransactions, cancelOrder };
