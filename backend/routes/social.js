const express = require('express');
const router = express.Router();
const { verifySupabaseToken } = require('../middlewares/supabaseVerify');
const { getPosts, toggleLike, addComment, getComments } = require('../controllers/socialController');

// All social routes are protected
router.use(verifySupabaseToken);

router.get('/posts', getPosts);
router.post('/like', toggleLike);
router.post('/comment', addComment);
router.get('/posts/:id/comments', getComments);

module.exports = router;
