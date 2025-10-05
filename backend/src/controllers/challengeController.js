const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get all challenges
// @route   GET /api/v1/challenges
// @access  Public/Private
exports.getAllChallenges = async (req, res) => {
  try {
    const { category, difficulty, isPremium } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Show premium challenges only to premium users
    if (!req.user || !req.user.isPremium) {
      filter.isPremium = false;
    }

    const challenges = await Challenge.find(filter)
      .sort({ 'stats.totalParticipants': -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching challenges',
      error: error.message
    });
  }
};

// @desc    Get featured challenges
// @route   GET /api/v1/challenges/featured
// @access  Public
exports.getFeaturedChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      isFeatured: true,
      isActive: true,
      isPremium: false
    })
    .limit(10);

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges
    });
  } catch (error) {
    console.error('Get featured challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured challenges',
      error: error.message
    });
  }
};

// @desc    Get daily personalized challenges
// @route   GET /api/v1/challenges/daily
// @access  Private
exports.getDailyChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get challenges based on user's lifestyle
    const categories = [];
    if (user.lifestyle.transportation.primaryMode === 'car') {
      categories.push('transportation');
    }
    if (user.lifestyle.diet === 'high_meat' || user.lifestyle.diet === 'omnivore') {
      categories.push('diet');
    }
    categories.push('energy', 'waste', 'general');

    const filter = {
      isActive: true,
      category: { $in: categories },
      _id: { $nin: user.completedChallenges }
    };

    if (!user.isPremium) {
      filter.isPremium = false;
    }

    const challenges = await Challenge.aggregate([
      { $match: filter },
      { $sample: { size: 3 } }
    ]);

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges
    });
  } catch (error) {
    console.error('Get daily challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily challenges',
      error: error.message
    });
  }
};

// @desc    Get challenge by ID
// @route   GET /api/v1/challenges/:id
// @access  Public/Private
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if premium challenge
    if (challenge.isPremium && (!req.user || !req.user.isPremium)) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required for this challenge'
      });
    }

    res.status(200).json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching challenge',
      error: error.message
    });
  }
};

// @desc    Start a challenge
// @route   POST /api/v1/challenges/:id/start
// @access  Private
exports.startChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if premium challenge
    if (challenge.isPremium && !user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required for this challenge'
      });
    }

    // Check if already active
    const isActive = user.activeChallenges.some(
      c => c.challengeId.toString() === challenge._id.toString()
    );

    if (isActive) {
      return res.status(400).json({
        success: false,
        message: 'Challenge already active'
      });
    }

    // Check if already completed
    const isCompleted = user.completedChallenges.some(
      c => c.toString() === challenge._id.toString()
    );

    if (isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Challenge already completed'
      });
    }

    // Add to active challenges
    user.activeChallenges.push({
      challengeId: challenge._id,
      startedAt: Date.now(),
      progress: 0
    });

    await user.save();

    // Update challenge stats
    await challenge.addParticipant();

    res.status(200).json({
      success: true,
      message: 'Challenge started successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        duration: challenge.duration,
        points: challenge.points
      }
    });
  } catch (error) {
    console.error('Start challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting challenge',
      error: error.message
    });
  }
};

// @desc    Complete a challenge
// @route   POST /api/v1/challenges/:id/complete
// @access  Private
exports.completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if challenge is active for user
    const activeChallengeIndex = user.activeChallenges.findIndex(
      c => c.challengeId.toString() === challenge._id.toString()
    );

    if (activeChallengeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Challenge not active. Please start it first.'
      });
    }

    // Remove from active challenges
    user.activeChallenges.splice(activeChallengeIndex, 1);

    // Add to completed challenges
    user.completedChallenges.push(challenge._id);

    // Award points
    user.points += challenge.points;
    user.updateLevel();

    // Update streak
    user.updateStreak();

    // Check for new badges
    const newBadges = checkForBadges(user);
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }

    await user.save();

    // Update challenge stats
    await challenge.recordCompletion();

    // Log in progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      userId: user._id,
      date: today
    });

    if (!progress) {
      progress = new Progress({
        userId: user._id,
        date: today
      });
    }

    progress.challengesCompleted.push({
      challengeId: challenge._id,
      pointsEarned: challenge.points,
      carbonSaved: challenge.carbonSaved,
      completedAt: Date.now()
    });

    progress.pointsEarned += challenge.points;
    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Challenge completed successfully! 🎉',
      rewards: {
        points: challenge.points,
        carbonSaved: challenge.carbonSaved,
        newBadges: newBadges.map(b => b.name),
        currentPoints: user.points,
        currentLevel: user.level,
        streak: user.streak.current
      }
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing challenge',
      error: error.message
    });
  }
};

// @desc    Get user's active challenges
// @route   GET /api/v1/challenges/user/active
// @access  Private
exports.getActiveChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('activeChallenges.challengeId');

    res.status(200).json({
      success: true,
      count: user.activeChallenges.length,
      challenges: user.activeChallenges
    });
  } catch (error) {
    console.error('Get active challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active challenges',
      error: error.message
    });
  }
};

// @desc    Get user's completed challenges
// @route   GET /api/v1/challenges/user/completed
// @access  Private
exports.getCompletedChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedChallenges');

    res.status(200).json({
      success: true,
      count: user.completedChallenges.length,
      challenges: user.completedChallenges
    });
  } catch (error) {
    console.error('Get completed challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching completed challenges',
      error: error.message
    });
  }
};

// Helper function: Check for new badges
function checkForBadges(user) {
  const badges = [];
  const existingBadgeNames = user.badges.map(b => b.name);

  // First challenge
  if (user.completedChallenges.length === 1 && !existingBadgeNames.includes('First Step')) {
    badges.push({
      name: 'First Step',
      icon: '👣',
      earnedAt: Date.now()
    });
  }

  // 10 challenges
  if (user.completedChallenges.length === 10 && !existingBadgeNames.includes('Eco Warrior')) {
    badges.push({
      name: 'Eco Warrior',
      icon: '⚔️',
      earnedAt: Date.now()
    });
  }

  // 50 challenges
  if (user.completedChallenges.length === 50 && !existingBadgeNames.includes('Climate Champion')) {
    badges.push({
      name: 'Climate Champion',
      icon: '🏆',
      earnedAt: Date.now()
    });
  }

  // 7 day streak
  if (user.streak.current === 7 && !existingBadgeNames.includes('Week Warrior')) {
    badges.push({
      name: 'Week Warrior',
      icon: '🔥',
      earnedAt: Date.now()
    });
  }

  // 30 day streak
  if (user.streak.current === 30 && !existingBadgeNames.includes('Month Master')) {
    badges.push({
      name: 'Month Master',
      icon: '💎',
      earnedAt: Date.now()
    });
  }

  // 1000 points
  if (user.points >= 1000 && !existingBadgeNames.includes('Point Collector')) {
    badges.push({
      name: 'Point Collector',
      icon: '⭐',
      earnedAt: Date.now()
    });
  }

  return badges;
}
