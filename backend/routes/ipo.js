const express = require('express');
const router = express.Router();
const { verifySupabaseToken } = require('../middlewares/supabaseVerify');
const { applyIpo, getIpoOrders } = require('../controllers/ipoController');

// All IPO routes are protected
router.use(verifySupabaseToken);

router.post('/apply', applyIpo);
router.get('/orders', getIpoOrders);

module.exports = router;
