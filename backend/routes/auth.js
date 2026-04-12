const express = require('express');
const router = express.Router();
const { verifySupabaseToken } = require('../middlewares/supabaseVerify');
const { getMe, supabaseLogin } = require('../controllers/userController');

// POST /auth/login
// Frontend sends Supabase Access Token; backend verifies, creates user, returns profile
router.post('/login', verifySupabaseToken, supabaseLogin);

// GET /me — get current user profile
router.get('/me', verifySupabaseToken, getMe);

module.exports = router;
