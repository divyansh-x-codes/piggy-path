const { prisma } = require('../prisma/client');

// GET /stocks — list all stocks with current price
const getAllStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { symbol: 'asc' },
    });
    res.json(stocks);
  } catch (err) {
    console.error('[StockController] getAllStocks error:', err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

// GET /stocks/:id — single stock with holding info if logged in
const getStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await prisma.stock.findUnique({ where: { id } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    // Get open orders stats
    const [buyOrders, sellOrders] = await Promise.all([
      prisma.order.count({ where: { stockId: id, type: 'BUY', status: { in: ['OPEN', 'PARTIALLY_FILLED'] } } }),
      prisma.order.count({ where: { stockId: id, type: 'SELL', status: { in: ['OPEN', 'PARTIALLY_FILLED'] } } }),
    ]);

    res.json({ ...stock, openBuys: buyOrders, openSells: sellOrders });
  } catch (err) {
    console.error('[StockController] getStock error:', err);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

// GET /stocks/:id/history — price history for graph
const getStockHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 200, range } = req.query;

    let since;
    if (range === '1d') since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    else if (range === '1w') since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    else if (range === '1m') since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    else if (range === '1y') since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    const where = { stockId: id };
    if (since) where.timestamp = { gte: since };

    const history = await prisma.priceHistory.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      take: parseInt(limit),
    });

    res.json(history.map((h) => ({ price: h.price, timestamp: h.timestamp })));
  } catch (err) {
    console.error('[StockController] getStockHistory error:', err);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
};

module.exports = { getAllStocks, getStock, getStockHistory };
