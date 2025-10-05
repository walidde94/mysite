# 🚀 Quick Start Guide

Get EcoStep up and running in 10 minutes!

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Python 3.9+ installed
- ✅ MongoDB 5.0+ running (or MongoDB Atlas account)
- ✅ Git installed

## Step-by-Step Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ecostep.git
cd ecostep
```

### 2️⃣ Setup Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
# At minimum, set:
# - MONGODB_URI=your-mongodb-connection-string
# - JWT_SECRET=your-random-secret-key

# Seed database with initial data
node src/seeds/challenges.js
node src/seeds/products.js

# Start backend server
npm run dev
```

Backend will be running at: **http://localhost:5000**

### 3️⃣ Setup AI Service (3 minutes)

```bash
# Open new terminal
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start AI service
python main.py
```

AI Service will be running at: **http://localhost:8000**

### 4️⃣ Setup Frontend (2 minutes)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at: **http://localhost:3000**

### 5️⃣ Test the Application

1. Open your browser and go to **http://localhost:3000**
2. Click "Get Started" to register a new account
3. Fill in your details and sign up
4. Explore the dashboard, challenges, and other features!

## 🐳 Alternative: Docker Setup (Easiest!)

If you have Docker installed, you can run everything with one command:

```bash
# From project root
docker-compose up -d

# Wait for services to start (1-2 minutes)
# Then open http://localhost:3000
```

That's it! All services will be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## 📱 Mobile App Setup

### For iOS (macOS only):

```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

### For Android:

```bash
cd mobile
npm install
npm run android
```

## 🔑 Important Configuration

### Get API Keys (Optional but Recommended)

1. **Stripe** (for payments):
   - Sign up at [stripe.com](https://stripe.com)
   - Get test keys from Dashboard
   - Add to backend `.env`:
     ```
     STRIPE_SECRET_KEY=sk_test_xxx
     STRIPE_PUBLISHABLE_KEY=pk_test_xxx
     ```

2. **OpenWeather API** (for climate data):
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Get free API key
   - Add to backend `.env`:
     ```
     OPENWEATHER_API_KEY=your_key_here
     ```

3. **Mapbox** (for maps and routes):
   - Sign up at [mapbox.com](https://mapbox.com)
   - Get API key
   - Add to backend `.env`:
     ```
     MAPBOX_API_KEY=your_key_here
     ```

## 🧪 Testing the Features

### Test User Account
After registration, try:
1. ✅ Update your lifestyle information in Profile
2. ✅ Calculate your carbon footprint
3. ✅ Start an eco-challenge
4. ✅ Complete a challenge to earn points
5. ✅ Check the leaderboard
6. ✅ Browse the eco marketplace

### API Testing
You can test the API directly:

```bash
# Register a user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test AI service
curl -X POST http://localhost:8000/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "transportation": {"primaryMode": "car", "distancePerDay": 25},
    "energy": {"electricityUsage": 10, "gasUsage": 5, "renewableEnergy": false},
    "diet": "omnivore",
    "shopping": {"clothesPerMonth": 2, "electronicsPerYear": 1}
  }'
```

## ⚡ Quick Tips

### Performance
- Backend automatically creates database indexes
- Frontend uses lazy loading for optimal performance
- AI service caches common calculations

### Development
- Backend auto-reloads on file changes (nodemon)
- Frontend has hot module replacement (HMR)
- AI service auto-reloads with uvicorn --reload

### Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongosh

# If using MongoDB Atlas, make sure to:
# 1. Whitelist your IP address
# 2. Use the correct connection string
# 3. Include database name and credentials
```

**Port Already in Use:**
```bash
# Change ports in .env files:
# Backend: PORT=5001
# AI Service: PORT=8001
# Frontend: Update vite.config.js server.port
```

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

Now that you're set up:

1. 📖 Read the [full documentation](README.md)
2. 🚀 Check out the [deployment guide](DEPLOYMENT.md)
3. 💻 Explore the codebase
4. 🤝 Join our [Discord community](https://discord.gg/ecostep)
5. ⭐ Star the repo if you find it useful!

## 📞 Need Help?

- 📧 Email: support@ecostep.app
- 💬 Discord: [Join our community](https://discord.gg/ecostep)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ecostep/issues)
- 📖 Docs: [docs.ecostep.app](https://docs.ecostep.app)

## 🎉 You're All Set!

Welcome to the EcoStep community! Together, we're making the world greener, one step at a time. 🌱

---

**Happy Coding!** 💚
