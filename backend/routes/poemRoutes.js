const express = require('express');
const router = express.Router();
const { getPoems, createPoem, deletePoem, updatePoem, addComment, addReply } = require('../controllers/poemController');
const { protect } = require('../middleware/auth');

router.get('/', getPoems); 
router.post('/', protect, createPoem); 
router.delete('/:id', protect, deletePoem);
router.put('/:id', protect, updatePoem);
router.post('/:id/comments', protect, addComment);
router.post('/:poemId/comments/:commentId/replies', protect, addReply);

module.exports = router;