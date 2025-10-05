const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable 100% organic cotton t-shirt. Fair trade certified and sustainably produced.',
    brand: {
      name: 'EcoWear',
      sustainabilityCertifications: ['GOTS', 'Fair Trade']
    },
    category: 'fashion',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Organic+Cotton+Tee', alt: 'Organic Cotton T-Shirt' }
    ],
    price: {
      amount: 29.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 2.1,
      ecoScore: 92,
      certifications: [
        { name: 'GOTS', icon: '🌿', verifiedBy: 'Global Organic Textile Standard' }
      ],
      materials: ['100% Organic Cotton'],
      recyclable: true,
      biodegradable: true
    },
    affiliate: {
      url: 'https://example.com/organic-tshirt',
      commission: 10,
      trackingCode: 'ECO001'
    },
    isFeatured: true,
    isActive: true,
    tags: ['organic', 'cotton', 'fair-trade', 'eco-friendly']
  },
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Biodegradable bamboo toothbrushes with soft bristles. Pack of 4.',
    brand: {
      name: 'ZeroWaste Home',
      sustainabilityCertifications: ['FSC']
    },
    category: 'beauty',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Bamboo+Toothbrush', alt: 'Bamboo Toothbrush' }
    ],
    price: {
      amount: 12.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 0.3,
      ecoScore: 95,
      certifications: [
        { name: 'FSC Certified', icon: '🌳', verifiedBy: 'Forest Stewardship Council' }
      ],
      materials: ['Bamboo', 'Natural Bristles'],
      recyclable: false,
      biodegradable: true
    },
    affiliate: {
      url: 'https://example.com/bamboo-toothbrush',
      commission: 15,
      trackingCode: 'ECO002'
    },
    isFeatured: true,
    isActive: true,
    tags: ['bamboo', 'zero-waste', 'biodegradable']
  },
  {
    name: 'Reusable Stainless Steel Water Bottle',
    description: 'Insulated 750ml water bottle keeps drinks cold for 24h, hot for 12h.',
    brand: {
      name: 'HydroGreen',
      sustainabilityCertifications: ['B Corp']
    },
    category: 'home',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Water+Bottle', alt: 'Reusable Water Bottle' }
    ],
    price: {
      amount: 34.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 5.2,
      ecoScore: 88,
      certifications: [
        { name: 'B Corporation', icon: '🏅', verifiedBy: 'B Lab' }
      ],
      materials: ['Stainless Steel', 'Silicone'],
      recyclable: true,
      biodegradable: false
    },
    affiliate: {
      url: 'https://example.com/water-bottle',
      commission: 12,
      trackingCode: 'ECO003'
    },
    isFeatured: true,
    isActive: true,
    tags: ['reusable', 'insulated', 'stainless-steel']
  },
  {
    name: 'Solar Power Bank',
    description: '20000mAh solar power bank with fast charging. Perfect for outdoor adventures.',
    brand: {
      name: 'SunCharge',
      sustainabilityCertifications: ['RoHS']
    },
    category: 'electronics',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Solar+Power+Bank', alt: 'Solar Power Bank' }
    ],
    price: {
      amount: 49.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 8.5,
      ecoScore: 78,
      certifications: [
        { name: 'RoHS Compliant', icon: '⚡', verifiedBy: 'EU Directive' }
      ],
      materials: ['Recycled ABS Plastic', 'Solar Panels'],
      recyclable: true,
      biodegradable: false
    },
    affiliate: {
      url: 'https://example.com/solar-powerbank',
      commission: 8,
      trackingCode: 'ECO004'
    },
    isFeatured: false,
    isActive: true,
    isPremiumOnly: false,
    tags: ['solar', 'renewable', 'electronics']
  },
  {
    name: 'Organic Coffee Beans - Fair Trade',
    description: 'Single-origin organic coffee beans from sustainable farms. Rich flavor, ethically sourced.',
    brand: {
      name: 'EarthBrew',
      sustainabilityCertifications: ['Organic', 'Fair Trade', 'Rainforest Alliance']
    },
    category: 'food',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Coffee+Beans', alt: 'Organic Coffee' }
    ],
    price: {
      amount: 15.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 3.2,
      ecoScore: 90,
      certifications: [
        { name: 'Fair Trade', icon: '☕', verifiedBy: 'Fairtrade International' },
        { name: 'Organic', icon: '🌿', verifiedBy: 'USDA' }
      ],
      materials: ['100% Organic Arabica Beans'],
      recyclable: true,
      biodegradable: true
    },
    affiliate: {
      url: 'https://example.com/organic-coffee',
      commission: 18,
      trackingCode: 'ECO005'
    },
    isFeatured: true,
    isActive: true,
    tags: ['organic', 'fair-trade', 'coffee']
  },
  {
    name: 'Recycled Yoga Mat',
    description: 'Non-toxic yoga mat made from 100% recycled materials. Extra thick and durable.',
    brand: {
      name: 'GreenFit',
      sustainabilityCertifications: ['OEKO-TEX']
    },
    category: 'sports',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Yoga+Mat', alt: 'Recycled Yoga Mat' }
    ],
    price: {
      amount: 44.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 4.8,
      ecoScore: 85,
      certifications: [
        { name: 'OEKO-TEX', icon: '✓', verifiedBy: 'OEKO-TEX Association' }
      ],
      materials: ['Recycled Rubber', 'TPE'],
      recyclable: true,
      biodegradable: false
    },
    affiliate: {
      url: 'https://example.com/yoga-mat',
      commission: 14,
      trackingCode: 'ECO006'
    },
    isFeatured: false,
    isActive: true,
    tags: ['recycled', 'yoga', 'fitness']
  },
  {
    name: 'Beeswax Food Wraps',
    description: 'Reusable food wraps made with organic cotton and beeswax. Set of 5 assorted sizes.',
    brand: {
      name: 'BeeWrap Co',
      sustainabilityCertifications: ['Organic', 'Plastic-Free']
    },
    category: 'home',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Beeswax+Wraps', alt: 'Beeswax Food Wraps' }
    ],
    price: {
      amount: 22.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 1.5,
      ecoScore: 94,
      certifications: [
        { name: 'Plastic-Free', icon: '🚫', verifiedBy: 'Plastic Free Trust' }
      ],
      materials: ['Organic Cotton', 'Beeswax', 'Tree Resin', 'Jojoba Oil'],
      recyclable: false,
      biodegradable: true
    },
    affiliate: {
      url: 'https://example.com/beeswax-wraps',
      commission: 16,
      trackingCode: 'ECO007'
    },
    isFeatured: true,
    isActive: true,
    tags: ['zero-waste', 'reusable', 'plastic-free']
  },
  {
    name: 'LED Smart Bulb - Energy Efficient',
    description: 'WiFi-enabled LED smart bulb. 90% more energy efficient than traditional bulbs.',
    brand: {
      name: 'BrightGreen',
      sustainabilityCertifications: ['Energy Star']
    },
    category: 'electronics',
    images: [
      { url: 'https://via.placeholder.com/600x600?text=Smart+LED+Bulb', alt: 'LED Smart Bulb' }
    ],
    price: {
      amount: 19.99,
      currency: 'EUR'
    },
    sustainability: {
      carbonFootprint: 2.8,
      ecoScore: 87,
      certifications: [
        { name: 'Energy Star', icon: '⭐', verifiedBy: 'EPA' }
      ],
      materials: ['Recycled Aluminum', 'LED Components'],
      recyclable: true,
      biodegradable: false
    },
    affiliate: {
      url: 'https://example.com/led-bulb',
      commission: 10,
      trackingCode: 'ECO008'
    },
    isFeatured: false,
    isActive: true,
    tags: ['energy-efficient', 'LED', 'smart-home']
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedProducts();
