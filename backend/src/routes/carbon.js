const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbonController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/calculate', carbonController.calculateFootprint);
router.get('/history', carbonController.getHistory);
router.post('/activity', carbonController.logActivity);
router.get('/insights', carbonController.getInsights);

module.exports = router;
