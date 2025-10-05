const axios = require('axios');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Calculate carbon footprint
// @route   POST /api/v1/carbon/calculate
// @access  Private
exports.calculateFootprint = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Prepare data for AI service
    const lifestyleData = {
      transportation: user.lifestyle.transportation,
      energy: user.lifestyle.energy,
      diet: user.lifestyle.diet,
      shopping: user.lifestyle.shopping
    };

    // Call Python AI service for carbon calculation
    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/calculate`,
        lifestyleData,
        { timeout: 10000 }
      );

      const carbonData = aiResponse.data;

      // Update user's carbon footprint
      user.carbonFootprint.daily = carbonData.daily;
      user.carbonFootprint.weekly = carbonData.weekly;
      user.carbonFootprint.monthly = carbonData.monthly;
      user.carbonFootprint.total += carbonData.daily;
      user.carbonFootprint.lastCalculated = Date.now();
      await user.save();

      // Create/update today's progress record
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

      progress.carbonData = {
        transportation: carbonData.breakdown.transportation || 0,
        energy: carbonData.breakdown.energy || 0,
        diet: carbonData.breakdown.diet || 0,
        shopping: carbonData.breakdown.shopping || 0,
        total: carbonData.daily
      };

      await progress.save();

      res.status(200).json({
        success: true,
        message: 'Carbon footprint calculated successfully',
        carbonFootprint: user.carbonFootprint,
        breakdown: carbonData.breakdown,
        recommendations: carbonData.recommendations || []
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback to simple calculation if AI service is unavailable
      const simpleCalculation = calculateSimpleFootprint(user.lifestyle);
      
      user.carbonFootprint.daily = simpleCalculation.daily;
      user.carbonFootprint.weekly = simpleCalculation.daily * 7;
      user.carbonFootprint.monthly = simpleCalculation.daily * 30;
      user.carbonFootprint.lastCalculated = Date.now();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Carbon footprint calculated (using simplified model)',
        carbonFootprint: user.carbonFootprint,
        breakdown: simpleCalculation.breakdown,
        note: 'AI service temporarily unavailable, using simplified calculation'
      });
    }
  } catch (error) {
    console.error('Calculate footprint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating carbon footprint',
      error: error.message
    });
  }
};

// @desc    Get carbon history
// @route   GET /api/v1/carbon/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const history = await Progress.find({
      userId: req.user.id,
      date: { $gte: startDate }
    })
    .sort({ date: 1 })
    .select('date carbonData');

    // Calculate trends
    const totalCarbon = history.reduce((sum, day) => sum + day.carbonData.total, 0);
    const averageDaily = history.length > 0 ? totalCarbon / history.length : 0;

    res.status(200).json({
      success: true,
      history,
      statistics: {
        totalCarbon,
        averageDaily,
        days: history.length,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching carbon history',
      error: error.message
    });
  }
};

// @desc    Log carbon activity
// @route   POST /api/v1/carbon/activity
// @access  Private
exports.logActivity = async (req, res) => {
  try {
    const { type, description, carbonImpact } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type and description are required'
      });
    }

    // Get or create today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      userId: req.user.id,
      date: today
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        date: today
      });
    }

    // Add activity
    progress.activities.push({
      type,
      description,
      carbonImpact: carbonImpact || 0,
      timestamp: Date.now()
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      activity: progress.activities[progress.activities.length - 1]
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging activity',
      error: error.message
    });
  }
};

// @desc    Get AI insights
// @route   GET /api/v1/carbon/insights
// @access  Private
exports.getInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get recent progress
    const recentProgress = await Progress.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(7);

    // Prepare data for AI service
    const insightData = {
      lifestyle: user.lifestyle,
      recentProgress: recentProgress.map(p => ({
        date: p.date,
        carbonData: p.carbonData,
        activities: p.activities
      })),
      carbonFootprint: user.carbonFootprint
    };

    try {
      // Call AI service for personalized insights
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/insights`,
        insightData,
        { timeout: 10000 }
      );

      res.status(200).json({
        success: true,
        insights: aiResponse.data.insights,
        recommendations: aiResponse.data.recommendations
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Return basic insights if AI service unavailable
      const basicInsights = generateBasicInsights(user, recentProgress);
      
      res.status(200).json({
        success: true,
        insights: basicInsights,
        note: 'AI service temporarily unavailable, showing basic insights'
      });
    }
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message
    });
  }
};

// Helper function: Simple carbon footprint calculation
function calculateSimpleFootprint(lifestyle) {
  const breakdown = {
    transportation: 0,
    energy: 0,
    diet: 0,
    shopping: 0
  };

  // Transportation (kg CO2 per day)
  const transportEmissions = {
    car: 2.3,
    public_transport: 0.6,
    bicycle: 0,
    walking: 0,
    motorcycle: 1.8,
    electric_car: 0.5
  };
  breakdown.transportation = 
    (transportEmissions[lifestyle.transportation.primaryMode] || 2.3) * 
    (lifestyle.transportation.distancePerDay / 10);

  // Energy (kg CO2 per day)
  breakdown.energy = 
    (lifestyle.energy.electricityUsage * 0.5 + lifestyle.energy.gasUsage * 2.5) * 
    (lifestyle.energy.renewableEnergy ? 0.3 : 1);

  // Diet (kg CO2 per day)
  const dietEmissions = {
    vegan: 2.5,
    vegetarian: 3.8,
    pescatarian: 4.6,
    omnivore: 7.2,
    high_meat: 10.5
  };
  breakdown.diet = dietEmissions[lifestyle.diet] || 7.2;

  // Shopping (kg CO2 per day)
  breakdown.shopping = 
    (lifestyle.shopping.clothesPerMonth * 15 / 30) +
    (lifestyle.shopping.electronicsPerYear * 100 / 365);

  const daily = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    daily,
    breakdown
  };
}

// Helper function: Generate basic insights
function generateBasicInsights(user, recentProgress) {
  const insights = [];

  // Transportation insight
  if (user.lifestyle.transportation.primaryMode === 'car') {
    insights.push({
      title: 'Switch to Public Transport',
      description: 'Using public transport instead of a car could reduce your carbon footprint by up to 2kg CO₂ per day.',
      category: 'transportation',
      potentialSaving: 2.0
    });
  }

  // Energy insight
  if (!user.lifestyle.energy.renewableEnergy) {
    insights.push({
      title: 'Consider Renewable Energy',
      description: 'Switching to renewable energy sources could cut your energy emissions by 70%.',
      category: 'energy',
      potentialSaving: user.carbonFootprint.daily * 0.3
    });
  }

  // Diet insight
  if (user.lifestyle.diet === 'high_meat' || user.lifestyle.diet === 'omnivore') {
    insights.push({
      title: 'Reduce Meat Consumption',
      description: 'Having 2-3 plant-based meals per week could save up to 3kg CO₂ weekly.',
      category: 'diet',
      potentialSaving: 0.43
    });
  }

  return insights;
}
