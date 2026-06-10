const express = require('express');
const router = express.Router();
const { getPoems, getPoemById, createPoem, deletePoem, updatePoem, addComment, addReply, updateComment, deleteComment, updateReply, deleteReply, getUserComments } = require('../controllers/poemController');
const { protect } = require('../middleware/auth');

router.get('/', getPoems); 
router.get('/:id', getPoemById);
router.post('/', protect, createPoem); 
router.delete('/:id', protect, deletePoem);
router.put('/:id', protect, updatePoem);
router.post('/:id/comments', protect, addComment);
router.post('/:poemId/comments/:commentId/replies', protect, addReply);
router.put('/:poemId/comments/:commentId', protect, updateComment);
router.delete('/:poemId/comments/:commentId', protect, deleteComment);
router.put('/:poemId/comments/:commentId/replies/:replyId', protect, updateReply);
router.delete('/:poemId/comments/:commentId/replies/:replyId', protect, deleteReply);
router.get('/user/:userId/comments', protect, getUserComments);

module.exports = router;