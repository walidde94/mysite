const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  
  // Lifestyle data
  lifestyle: {
    transportation: {
      primaryMode: {
        type: String,
        enum: ['car', 'public_transport', 'bicycle', 'walking', 'motorcycle', 'electric_car'],
        default: 'car'
      },
      distancePerDay: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    energy: {
      electricityUsage: {
        type: Number,
        default: 0,
        min: 0
      },
      gasUsage: {
        type: Number,
        default: 0,
        min: 0
      },
      renewableEnergy: {
        type: Boolean,
        default: false
      }
    },
    diet: {
      type: String,
      enum: ['vegan', 'vegetarian', 'pescatarian', 'omnivore', 'high_meat'],
      default: 'omnivore'
    },
    shopping: {
      clothesPerMonth: {
        type: Number,
        default: 0,
        min: 0
      },
      electronicsPerYear: {
        type: Number,
        default: 0,
        min: 0
      },
      recyclingHabit: {
        type: String,
        enum: ['always', 'often', 'sometimes', 'rarely', 'never'],
        default: 'sometimes'
      }
    }
  },

  // Gamification
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streak: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    longest: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },

  // Carbon tracking
  carbonFootprint: {
    daily: {
      type: Number,
      default: 0
    },
    weekly: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },

  // Preferences
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },

  // Activity tracking
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  activeChallenges: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],

  lastLogin: {
    type: Date,
    default: Date.now
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Calculate level based on points
userSchema.methods.updateLevel = function() {
  this.level = Math.floor(this.points / 1000) + 1;
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActive = new Date(this.streak.lastActiveDate).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) {
    // Same day, no change
    return;
  } else if (dayDiff === 1) {
    // Consecutive day
    this.streak.current += 1;
    if (this.streak.current > this.streak.longest) {
      this.streak.longest = this.streak.current;
    }
  } else {
    // Streak broken
    this.streak.current = 1;
  }
  
  this.streak.lastActiveDate = Date.now();
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
