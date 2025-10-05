const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/dashboard', progressController.getDashboard);
router.get('/history', progressController.getHistory);
router.get('/stats', progressController.getStats);
router.get('/charts', progressController.getChartData);

module.exports = router;
