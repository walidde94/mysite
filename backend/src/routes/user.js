const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/lifestyle', userController.updateLifestyle);
router.get('/badges', userController.getBadges);
router.get('/stats', userController.getStats);

module.exports = router;
