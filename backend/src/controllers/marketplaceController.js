const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/v1/marketplace/products
// @access  Public/Private
exports.getProducts = async (req, res) => {
  try {
    const { category, minEcoScore, maxPrice, sortBy = 'ecoScore', limit = 50 } = req.query;
    
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minEcoScore) filter['sustainability.ecoScore'] = { $gte: parseInt(minEcoScore) };
    if (maxPrice) filter['price.amount'] = { $lte: parseFloat(maxPrice) };

    // Hide premium-only products from free users
    if (!req.user || !req.user.isPremium) {
      filter.isPremiumOnly = false;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'ecoScore':
        sortOptions = { 'sustainability.ecoScore': -1 };
        break;
      case 'price_low':
        sortOptions = { 'price.amount': 1 };
        break;
      case 'price_high':
        sortOptions = { 'price.amount': -1 };
        break;
      case 'popular':
        sortOptions = { 'stats.views': -1 };
        break;
      case 'rating':
        sortOptions = { 'stats.rating.average': -1 };
        break;
      default:
        sortOptions = { 'sustainability.ecoScore': -1 };
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/v1/marketplace/products/:id
// @access  Public/Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if premium-only
    if (product.isPremiumOnly && (!req.user || !req.user.isPremium)) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required to view this product'
      });
    }

    // Track view
    await product.recordView();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Track product click
// @route   POST /api/v1/marketplace/products/:id/click
// @access  Private
exports.trackClick = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Track click
    await product.recordClick();

    res.status(200).json({
      success: true,
      message: 'Click tracked',
      affiliateUrl: product.affiliate.url
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking click',
      error: error.message
    });
  }
};

// @desc    Get product categories
// @route   GET /api/v1/marketplace/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'fashion', name: 'Fashion', icon: '👗' },
      { id: 'food', name: 'Food', icon: '🥗' },
      { id: 'home', name: 'Home', icon: '🏠' },
      { id: 'electronics', name: 'Electronics', icon: '📱' },
      { id: 'beauty', name: 'Beauty', icon: '💄' },
      { id: 'sports', name: 'Sports', icon: '⚽' },
      { id: 'books', name: 'Books', icon: '📚' },
      { id: 'other', name: 'Other', icon: '🌱' }
    ];

    // Get product counts per category
    const categoryCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categoriesWithCounts = categories.map(cat => {
      const countData = categoryCounts.find(c => c._id === cat.id);
      return {
        ...cat,
        productCount: countData ? countData.count : 0
      };
    });

    res.status(200).json({
      success: true,
      categories: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/v1/marketplace/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      isPremiumOnly: false
    })
    .limit(10);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};
