const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Daily carbon footprint breakdown
  carbonData: {
    transportation: {
      type: Number,
      default: 0,
      min: 0
    },
    energy: {
      type: Number,
      default: 0,
      min: 0
    },
    diet: {
      type: Number,
      default: 0,
      min: 0
    },
    shopping: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Activities tracked
  activities: [{
    type: {
      type: String,
      enum: ['transport', 'meal', 'purchase', 'energy_usage', 'recycling', 'other']
    },
    description: String,
    carbonImpact: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Challenges completed today
  challengesCompleted: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    pointsEarned: Number,
    carbonSaved: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Points earned today
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },

  // Daily goal achievement
  goals: {
    carbonTarget: {
      type: Number,
      default: 0
    },
    achieved: {
      type: Boolean,
      default: false
    }
  },

  // AI recommendations given
  aiRecommendations: [{
    title: String,
    description: String,
    potentialSaving: Number,
    category: String,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient user+date queries
progressSchema.index({ userId: 1, date: -1 });

// Method to calculate total carbon for the day
progressSchema.methods.calculateTotal = function() {
  this.carbonData.total = 
    this.carbonData.transportation +
    this.carbonData.energy +
    this.carbonData.diet +
    this.carbonData.shopping;
  return this.carbonData.total;
};

module.exports = mongoose.model('Progress', progressSchema);
