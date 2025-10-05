const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update lifestyle data
// @route   PUT /api/v1/users/lifestyle
// @access  Private
exports.updateLifestyle = async (req, res) => {
  try {
    const { transportation, energy, diet, shopping } = req.body;

    const user = await User.findById(req.user.id);

    if (transportation) user.lifestyle.transportation = { ...user.lifestyle.transportation, ...transportation };
    if (energy) user.lifestyle.energy = { ...user.lifestyle.energy, ...energy };
    if (diet) user.lifestyle.diet = diet;
    if (shopping) user.lifestyle.shopping = { ...user.lifestyle.shopping, ...shopping };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Lifestyle updated successfully',
      lifestyle: user.lifestyle
    });
  } catch (error) {
    console.error('Update lifestyle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lifestyle',
      error: error.message
    });
  }
};

// @desc    Get user badges
// @route   GET /api/v1/users/badges
// @access  Private
exports.getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      badges: user.badges,
      totalBadges: user.badges.length
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get recent progress data
    const recentProgress = await Progress.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(30);

    // Calculate statistics
    const totalCarbonSaved = recentProgress.reduce((sum, p) => {
      return sum + (p.challengesCompleted.reduce((s, c) => s + c.carbonSaved, 0));
    }, 0);

    const stats = {
      points: user.points,
      level: user.level,
      streak: user.streak,
      carbonFootprint: user.carbonFootprint,
      totalCarbonSaved,
      completedChallenges: user.completedChallenges.length,
      activeChallenges: user.activeChallenges.length,
      badges: user.badges.length,
      recentActivity: recentProgress.slice(0, 7)
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
