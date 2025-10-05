const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  brand: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    sustainabilityCertifications: [String]
  },
  category: {
    type: String,
    required: true,
    enum: ['fashion', 'food', 'home', 'electronics', 'beauty', 'sports', 'books', 'other'],
    index: true
  },
  images: [{
    url: String,
    alt: String
  }],
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  
  // Sustainability metrics
  sustainability: {
    carbonFootprint: {
      type: Number,
      min: 0,
      comment: 'Carbon footprint in kg CO2'
    },
    ecoScore: {
      type: Number,
      min: 0,
      max: 100,
      comment: 'Eco-friendliness score out of 100'
    },
    certifications: [{
      name: String,
      icon: String,
      verifiedBy: String
    }],
    materials: [String],
    recyclable: {
      type: Boolean,
      default: false
    },
    biodegradable: {
      type: Boolean,
      default: false
    }
  },

  // Affiliate information
  affiliate: {
    url: {
      type: String,
      required: true
    },
    commission: {
      type: Number,
      min: 0,
      max: 100,
      comment: 'Commission percentage'
    },
    trackingCode: String
  },

  // Product stats
  stats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0
    },
    purchases: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },

  // Visibility
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremiumOnly: {
    type: Boolean,
    default: false
  },

  tags: [String],
  stockStatus: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'sustainability.ecoScore': -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ 'stats.rating.average': -1 });

// Method to record view
productSchema.methods.recordView = function() {
  this.stats.views += 1;
  return this.save();
};

// Method to record click
productSchema.methods.recordClick = function() {
  this.stats.clicks += 1;
  return this.save();
};

// Method to record purchase
productSchema.methods.recordPurchase = function() {
  this.stats.purchases += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
