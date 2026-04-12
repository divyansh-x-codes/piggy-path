const express = require('express');
const { verifySupabaseToken } = require('../middlewares/supabaseVerify');
const {
  placeBuyOrder,
  placeSellOrder,
  getOrders,
  getTransactions,
  cancelOrder,
} = require('../controllers/tradeController');

/**
 * Trade routes — all require authentication
 * The matching engine is injected so routes have access to it.
 */
const createTradeRouter = (engine) => {
  const router = express.Router();

  // All trade routes require authentication
  router.use(verifySupabaseToken);

  // POST /buy — place a buy order
  router.post('/buy', placeBuyOrder(engine));

  // POST /sell — place a sell order
  router.post('/sell', placeSellOrder(engine));

  // GET /orders — get user's orders
  router.get('/orders', getOrders);

  // GET /transactions — get user's executed trades
  router.get('/transactions', getTransactions);

  // DELETE /orders/:id — cancel an open order
  router.delete('/orders/:id', cancelOrder);

  return router;
};

module.exports = createTradeRouter;
