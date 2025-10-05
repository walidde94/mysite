const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/products', optionalAuth, marketplaceController.getProducts);
router.get('/products/:id', optionalAuth, marketplaceController.getProductById);
router.post('/products/:id/click', protect, marketplaceController.trackClick);
router.get('/categories', marketplaceController.getCategories);
router.get('/featured', marketplaceController.getFeaturedProducts);

module.exports = router;
