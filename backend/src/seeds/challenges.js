const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

const challenges = [
  {
    title: 'Walk or Bike for 30 Minutes',
    description: 'Leave your car at home today and walk or bike for at least 30 minutes.',
    category: 'transportation',
    difficulty: 'easy',
    duration: 1,
    points: 50,
    carbonSaved: 2.5,
    icon: '🚶',
    isPremium: false,
    isFeatured: true,
    verification: { type: 'none' },
    tips: [
      'Plan your route in advance',
      'Wear comfortable shoes',
      'Enjoy the fresh air and scenery'
    ]
  },
  {
    title: 'Meatless Monday',
    description: 'Go completely plant-based for the entire day. Try new vegan recipes!',
    category: 'diet',
    difficulty: 'easy',
    duration: 1,
    points: 75,
    carbonSaved: 4.2,
    icon: '🥗',
    isPremium: false,
    isFeatured: true,
    verification: { type: 'none' },
    tips: [
      'Explore plant-based protein sources like tofu, lentils, and beans',
      'Try a new vegetable you\'ve never cooked before',
      'Check out vegan recipe blogs for inspiration'
    ]
  },
  {
    title: 'Unplug for 3 Hours',
    description: 'Turn off all unnecessary electronics and lights for 3 hours.',
    category: 'energy',
    difficulty: 'easy',
    duration: 1,
    points: 60,
    carbonSaved: 1.5,
    icon: '🔌',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Use this time for outdoor activities or reading',
      'Unplug devices at the wall, not just turn them off',
      'Consider doing this regularly to reduce energy waste'
    ]
  },
  {
    title: 'Zero Waste Day',
    description: 'Produce no waste for an entire day. Refuse, reduce, reuse!',
    category: 'waste',
    difficulty: 'hard',
    duration: 1,
    points: 150,
    carbonSaved: 5.0,
    icon: '♻️',
    isPremium: false,
    isFeatured: true,
    verification: { type: 'photo', instructions: 'Take a photo of your waste-free day!' },
    tips: [
      'Bring reusable bags and containers when shopping',
      'Say no to single-use items',
      'Compost organic waste'
    ]
  },
  {
    title: 'Public Transport Week',
    description: 'Use only public transportation for an entire week.',
    category: 'transportation',
    difficulty: 'medium',
    duration: 7,
    points: 200,
    carbonSaved: 15.0,
    icon: '🚌',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Plan your routes in advance',
      'Get a weekly transit pass',
      'Use the commute time for reading or podcasts'
    ]
  },
  {
    title: 'Second-Hand Shopping Only',
    description: 'Buy only second-hand items for a month. No new purchases!',
    category: 'shopping',
    difficulty: 'hard',
    duration: 30,
    points: 300,
    carbonSaved: 20.0,
    icon: '🛍️',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Explore thrift stores and online second-hand marketplaces',
      'Quality check items before purchasing',
      'Share your finds on social media to inspire others'
    ]
  },
  {
    title: 'Reduce Shower Time',
    description: 'Take 5-minute showers for a week to save water and energy.',
    category: 'water',
    difficulty: 'easy',
    duration: 7,
    points: 100,
    carbonSaved: 3.5,
    icon: '🚿',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Use a timer or play a 5-minute song',
      'Turn off water while lathering',
      'Consider installing a low-flow showerhead'
    ]
  },
  {
    title: 'LED Light Switch',
    description: 'Replace all bulbs in your home with energy-efficient LEDs.',
    category: 'energy',
    difficulty: 'medium',
    duration: 1,
    points: 120,
    carbonSaved: 10.0,
    icon: '💡',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'photo', instructions: 'Take a photo of your new LED bulbs!' },
    tips: [
      'LEDs use 75% less energy than incandescent bulbs',
      'They last 25 times longer',
      'Choose warm white for living areas, cool white for work spaces'
    ]
  },
  {
    title: 'Plant-Based Week',
    description: 'Eat only plant-based foods for 7 days straight.',
    category: 'diet',
    difficulty: 'medium',
    duration: 7,
    points: 250,
    carbonSaved: 28.0,
    icon: '🌱',
    isPremium: true,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Meal prep to make it easier',
      'Discover new plant-based restaurants',
      'Track how you feel throughout the week'
    ],
    resources: [
      { title: 'Vegan Meal Prep Guide', url: 'https://example.com', type: 'article' }
    ]
  },
  {
    title: 'Bike to Work Month',
    description: 'Cycle to work every day for an entire month.',
    category: 'transportation',
    difficulty: 'hard',
    duration: 30,
    points: 500,
    carbonSaved: 60.0,
    icon: '🚴',
    isPremium: true,
    isFeatured: false,
    verification: { type: 'gps', instructions: 'Track your rides with GPS' },
    tips: [
      'Invest in proper safety gear',
      'Plan safe routes away from heavy traffic',
      'Keep a change of clothes at work'
    ]
  },
  {
    title: 'Local Food Challenge',
    description: 'Buy only locally-sourced food for 2 weeks.',
    category: 'shopping',
    difficulty: 'medium',
    duration: 14,
    points: 180,
    carbonSaved: 12.0,
    icon: '🥕',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Visit farmers markets',
      'Join a local CSA program',
      'Learn about seasonal produce'
    ]
  },
  {
    title: 'Digital Detox Day',
    description: 'Avoid all screens and digital devices for 24 hours.',
    category: 'energy',
    difficulty: 'medium',
    duration: 1,
    points: 80,
    carbonSaved: 2.0,
    icon: '📵',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Plan outdoor activities',
      'Read physical books',
      'Spend quality time with family and friends'
    ]
  },
  {
    title: 'Reusable Everything Week',
    description: 'Use only reusable items - no single-use products for 7 days.',
    category: 'waste',
    difficulty: 'medium',
    duration: 7,
    points: 150,
    carbonSaved: 8.0,
    icon: '🥤',
    isPremium: false,
    isFeatured: true,
    verification: { type: 'none' },
    tips: [
      'Carry reusable bags, bottles, and containers',
      'Say no to plastic straws and cutlery',
      'Bring your own cup to coffee shops'
    ]
  },
  {
    title: 'Carpool Champion',
    description: 'Carpool with colleagues or friends for 2 weeks.',
    category: 'transportation',
    difficulty: 'easy',
    duration: 14,
    points: 140,
    carbonSaved: 18.0,
    icon: '🚗',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'none' },
    tips: [
      'Coordinate schedules with coworkers',
      'Take turns driving',
      'Share fuel costs'
    ]
  },
  {
    title: 'Compost Starter',
    description: 'Start composting your organic waste for a month.',
    category: 'waste',
    difficulty: 'medium',
    duration: 30,
    points: 200,
    carbonSaved: 15.0,
    icon: '🪴',
    isPremium: false,
    isFeatured: false,
    verification: { type: 'photo', instructions: 'Photo of your compost bin' },
    tips: [
      'Balance green and brown materials',
      'Turn compost regularly',
      'Use finished compost in your garden'
    ]
  }
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    await Challenge.deleteMany({});
    console.log('🗑️  Cleared existing challenges');

    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ Created ${createdChallenges.length} challenges`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedChallenges();
