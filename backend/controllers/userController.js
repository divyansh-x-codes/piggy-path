const { prisma } = require('../prisma/client');

// GET /me — return the logged-in user's profile
const getMe = async (req, res) => {
  try {
    const user = req.user.dbUser;

    const holdings = await prisma.holding.findMany({
      where: { userId: user.id },
      include: { stock: true },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      holdings: holdings.map((h) => ({
        stockId: h.stockId,
        symbol: h.stock.symbol,
        name: h.stock.name,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        currentPrice: h.stock.currentPrice,
        currentValue: h.stock.currentPrice * h.quantity,
        pnl: (h.stock.currentPrice - h.avgPrice) * h.quantity,
      })),
    });
  } catch (err) {
    console.error('[UserController] getMe error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// POST /auth/login — verify token and return user info
// (token verification is handled by middleware; this just returns the user)
const supabaseLogin = async (req, res) => {
  try {
    const user = req.user.dbUser;
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { getMe, supabaseLogin };
