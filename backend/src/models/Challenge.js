const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['transportation', 'energy', 'diet', 'shopping', 'water', 'waste', 'general'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    comment: 'Duration in days'
  },
  points: {
    type: Number,
    required: true,
    min: 10,
    default: 50
  },
  carbonSaved: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Estimated CO2 saved in kg'
  },
  icon: {
    type: String,
    default: '🌱'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Verification requirements
  verification: {
    type: {
      type: String,
      enum: ['auto', 'manual', 'photo', 'gps', 'none'],
      default: 'none'
    },
    instructions: String
  },

  // Tips and resources
  tips: [String],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'tool', 'other']
    }
  }],

  // Sponsor information (for monetization)
  sponsor: {
    name: String,
    logo: String,
    url: String,
    isActive: {
      type: Boolean,
      default: false
    }
  },

  // Statistics
  stats: {
    totalParticipants: {
      type: Number,
      default: 0,
      min: 0
    },
    totalCompletions: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
challengeSchema.index({ category: 1, difficulty: 1, isActive: 1 });
challengeSchema.index({ isFeatured: 1, isActive: 1 });
challengeSchema.index({ 'stats.totalParticipants': -1 });

// Method to increment participant count
challengeSchema.methods.addParticipant = function() {
  this.stats.totalParticipants += 1;
  return this.save();
};

// Method to record completion
challengeSchema.methods.recordCompletion = function() {
  this.stats.totalCompletions += 1;
  return this.save();
};

module.exports = mongoose.model('Challenge', challengeSchema);
