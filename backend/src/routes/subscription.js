const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/status', subscriptionController.getSubscriptionStatus);
router.post('/create-checkout', subscriptionController.createCheckoutSession);
router.post('/webhook', subscriptionController.handleWebhook);
router.post('/cancel', subscriptionController.cancelSubscription);

module.exports = router;
