const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', protect, authController.updateProfile);
router.get('/user/:id', authController.getUserById);
router.get('/notifications', protect, authController.getNotifications);
router.put('/notifications/:notifId/read', protect, authController.markNotificationRead);
router.delete('/user/:id', protect, authController.deleteUser);

module.exports = router;