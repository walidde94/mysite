const User = require('../models/User');
const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');

// @desc    Get dashboard data
// @route   GET /api/v1/progress/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('activeChallenges.challengeId');

    // Get today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayProgress = await Progress.findOne({
      userId: user._id,
      date: today
    });

    // Get this week's data
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekProgress = await Progress.find({
      userId: user._id,
      date: { $gte: startOfWeek }
    });

    // Calculate weekly stats
    const weeklyPoints = weekProgress.reduce((sum, p) => sum + p.pointsEarned, 0);
    const weeklyCarbon = weekProgress.reduce((sum, p) => sum + p.carbonData.total, 0);
    const weeklyChallenges = weekProgress.reduce((sum, p) => sum + p.challengesCompleted.length, 0);

    // Get daily challenges
    const dailyChallenges = await Challenge.aggregate([
      {
        $match: {
          isActive: true,
          _id: { $nin: user.completedChallenges }
        }
      },
      { $sample: { size: 3 } }
    ]);

    const dashboard = {
      user: {
        name: user.name,
        avatar: user.avatar,
        level: user.level,
        points: user.points,
        isPremium: user.isPremium,
        streak: user.streak
      },
      today: {
        carbonFootprint: todayProgress ? todayProgress.carbonData.total : 0,
        pointsEarned: todayProgress ? todayProgress.pointsEarned : 0,
        challengesCompleted: todayProgress ? todayProgress.challengesCompleted.length : 0,
        activities: todayProgress ? todayProgress.activities : []
      },
      thisWeek: {
        totalPoints: weeklyPoints,
        totalCarbon: weeklyCarbon,
        challengesCompleted: weeklyChallenges,
        averageDaily: weeklyCarbon / (weekProgress.length || 1)
      },
      activeChallenges: user.activeChallenges,
      dailyChallenges,
      carbonFootprint: user.carbonFootprint,
      recentBadges: user.badges.slice(-5).reverse()
    };

    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get progress history
// @route   GET /api/v1/progress/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const history = await Progress.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .populate('challengesCompleted.challengeId');

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress history',
      error: error.message
    });
  }
};

// @desc    Get detailed statistics
// @route   GET /api/v1/progress/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get all progress records
    const allProgress = await Progress.find({ userId: user._id })
      .sort({ date: -1 });

    // Calculate comprehensive statistics
    const totalDays = allProgress.length;
    const totalCarbon = allProgress.reduce((sum, p) => sum + p.carbonData.total, 0);
    const totalPoints = allProgress.reduce((sum, p) => sum + p.pointsEarned, 0);
    const totalChallenges = allProgress.reduce((sum, p) => sum + p.challengesCompleted.length, 0);
    const totalCarbonSaved = allProgress.reduce((sum, p) => {
      return sum + p.challengesCompleted.reduce((s, c) => s + c.carbonSaved, 0);
    }, 0);

    // Get category breakdown
    const categoryBreakdown = {
      transportation: 0,
      energy: 0,
      diet: 0,
      shopping: 0
    };

    allProgress.forEach(p => {
      categoryBreakdown.transportation += p.carbonData.transportation;
      categoryBreakdown.energy += p.carbonData.energy;
      categoryBreakdown.diet += p.carbonData.diet;
      categoryBreakdown.shopping += p.carbonData.shopping;
    });

    // Get monthly comparison
    const last30Days = allProgress.slice(0, 30);
    const previous30Days = allProgress.slice(30, 60);

    const last30Carbon = last30Days.reduce((sum, p) => sum + p.carbonData.total, 0);
    const prev30Carbon = previous30Days.reduce((sum, p) => sum + p.carbonData.total, 0);
    const carbonChange = prev30Carbon > 0 ? ((prev30Carbon - last30Carbon) / prev30Carbon * 100) : 0;

    const stats = {
      overview: {
        totalDays,
        totalCarbon,
        averageDaily: totalDays > 0 ? totalCarbon / totalDays : 0,
        totalPoints,
        totalChallenges,
        totalCarbonSaved,
        badges: user.badges.length,
        level: user.level,
        streak: user.streak
      },
      categoryBreakdown,
      monthlyComparison: {
        last30Days: last30Carbon,
        previous30Days: prev30Carbon,
        change: carbonChange,
        improving: carbonChange > 0
      },
      milestones: {
        firstActivity: allProgress[allProgress.length - 1]?.date,
        totalActiveDays: totalDays,
        longestStreak: user.streak.longest,
        currentStreak: user.streak.current
      }
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

// @desc    Get chart data
// @route   GET /api/v1/progress/charts
// @access  Private
exports.getChartData = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const progressData = await Progress.find({
      userId: req.user.id,
      date: { $gte: startDate }
    })
    .sort({ date: 1 })
    .select('date carbonData pointsEarned challengesCompleted');

    // Format data for charts
    const chartData = {
      carbonTrend: progressData.map(p => ({
        date: p.date,
        total: p.carbonData.total,
        transportation: p.carbonData.transportation,
        energy: p.carbonData.energy,
        diet: p.carbonData.diet,
        shopping: p.carbonData.shopping
      })),
      pointsTrend: progressData.map(p => ({
        date: p.date,
        points: p.pointsEarned
      })),
      challengesTrend: progressData.map(p => ({
        date: p.date,
        count: p.challengesCompleted.length
      })),
      categoryDistribution: calculateCategoryDistribution(progressData)
    };

    res.status(200).json({
      success: true,
      period: `${days} days`,
      chartData
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data',
      error: error.message
    });
  }
};

// Helper function
function calculateCategoryDistribution(progressData) {
  const totals = {
    transportation: 0,
    energy: 0,
    diet: 0,
    shopping: 0
  };

  progressData.forEach(p => {
    totals.transportation += p.carbonData.transportation;
    totals.energy += p.carbonData.energy;
    totals.diet += p.carbonData.diet;
    totals.shopping += p.carbonData.shopping;
  });

  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return Object.entries(totals).map(([category, value]) => ({
    category,
    value,
    percentage: total > 0 ? (value / total * 100).toFixed(1) : 0
  }));
}
