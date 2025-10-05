const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get global leaderboard
// @route   GET /api/v1/leaderboard/global
// @access  Public
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const leaderboard = await User.find({ accountStatus: 'active' })
      .select('name avatar points level streak badges')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    // Get current user's rank if authenticated
    let userRank = null;
    if (req.user) {
      const rank = await User.countDocuments({
        accountStatus: 'active',
        points: { $gt: req.user.points }
      });
      userRank = rank + 1;
    }

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        level: user.level,
        streak: user.streak.current,
        badges: user.badges.length
      })),
      userRank
    });
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// @desc    Get weekly leaderboard
// @route   GET /api/v1/leaderboard/weekly
// @access  Public
exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    // Get start of week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Aggregate weekly points from Progress collection
    const weeklyStats = await Progress.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: '$userId',
          weeklyPoints: { $sum: '$pointsEarned' },
          challengesCompleted: { $sum: { $size: '$challengesCompleted' } },
          carbonSaved: {
            $sum: {
              $reduce: {
                input: '$challengesCompleted',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.carbonSaved'] }
              }
            }
          }
        }
      },
      { $sort: { weeklyPoints: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Populate user data
    const leaderboard = await User.populate(weeklyStats, {
      path: '_id',
      select: 'name avatar level'
    });

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id._id,
      name: entry._id.name,
      avatar: entry._id.avatar,
      level: entry._id.level,
      weeklyPoints: entry.weeklyPoints,
      challengesCompleted: entry.challengesCompleted,
      carbonSaved: entry.carbonSaved
    }));

    // Get current user's rank if authenticated
    let userRank = null;
    let userStats = null;
    if (req.user) {
      const userIndex = weeklyStats.findIndex(
        s => s._id.toString() === req.user.id.toString()
      );
      if (userIndex !== -1) {
        userRank = userIndex + 1;
        userStats = formattedLeaderboard[userIndex];
      }
    }

    res.status(200).json({
      success: true,
      count: formattedLeaderboard.length,
      period: 'This Week',
      leaderboard: formattedLeaderboard,
      userRank,
      userStats
    });
  } catch (error) {
    console.error('Get weekly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly leaderboard',
      error: error.message
    });
  }
};

// @desc    Get friends leaderboard
// @route   GET /api/v1/leaderboard/friends
// @access  Private
exports.getFriendsLeaderboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // TODO: Implement friends system
    // For now, return empty leaderboard with message

    res.status(200).json({
      success: true,
      count: 0,
      leaderboard: [],
      message: 'Friends feature coming soon!'
    });
  } catch (error) {
    console.error('Get friends leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching friends leaderboard',
      error: error.message
    });
  }
};
