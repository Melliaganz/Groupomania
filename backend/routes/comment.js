const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');
const likeCtrl = require('../controllers/like');

// Create a new comment for a specific message
router.post('/:id/comment', auth, commentCtrl.createComment);

router.post('/:messageId/comment/:commentId/like', auth, likeCtrl.toggleCommentLike);

// Get all comments for a specific message
router.get('/:id/comments', auth, commentCtrl.getMessageAllComments);

// Get a specific comment from a specific message
router.get('/:messageId/comment/:commentId', auth, commentCtrl.getOneComment);

// Delete a specific comment from a specific message
router.delete('/:messageId/comment/:commentId', auth, commentCtrl.deleteComments);

module.exports = router;
