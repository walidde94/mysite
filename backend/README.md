# EcoStep Backend API

RESTful API for the EcoStep AI Personal Climate Coach application.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Carbon Footprint Tracking**: Calculate and track carbon emissions
- **Eco Challenges**: Browse, start, and complete sustainability challenges
- **Leaderboard**: Global and weekly rankings
- **Marketplace**: Curated sustainable products with affiliate tracking
- **Progress Dashboard**: Detailed analytics and insights
- **Premium Subscriptions**: Stripe payment integration
- **Gamification**: Points, levels, badges, and streaks

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 9.0.0

## 🔧 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Start MongoDB locally or use MongoDB Atlas

## 🏃 Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🌱 Seeding Data

Seed challenges:
```bash
node src/seeds/challenges.js
```

Seed products:
```bash
node src/seeds/products.js
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updateprofile` - Update profile
- `PUT /api/v1/auth/updatepassword` - Update password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/lifestyle` - Update lifestyle data
- `GET /api/v1/users/badges` - Get user badges
- `GET /api/v1/users/stats` - Get user statistics

### Carbon Tracking
- `POST /api/v1/carbon/calculate` - Calculate carbon footprint
- `GET /api/v1/carbon/history` - Get carbon history
- `POST /api/v1/carbon/activity` - Log carbon activity
- `GET /api/v1/carbon/insights` - Get AI insights

### Challenges
- `GET /api/v1/challenges` - Get all challenges
- `GET /api/v1/challenges/featured` - Get featured challenges
- `GET /api/v1/challenges/daily` - Get daily personalized challenges
- `GET /api/v1/challenges/:id` - Get challenge by ID
- `POST /api/v1/challenges/:id/start` - Start a challenge
- `POST /api/v1/challenges/:id/complete` - Complete a challenge
- `GET /api/v1/challenges/user/active` - Get active challenges
- `GET /api/v1/challenges/user/completed` - Get completed challenges

### Leaderboard
- `GET /api/v1/leaderboard/global` - Get global leaderboard
- `GET /api/v1/leaderboard/weekly` - Get weekly leaderboard
- `GET /api/v1/leaderboard/friends` - Get friends leaderboard

### Marketplace
- `GET /api/v1/marketplace/products` - Get all products
- `GET /api/v1/marketplace/products/:id` - Get product by ID
- `POST /api/v1/marketplace/products/:id/click` - Track affiliate click
- `GET /api/v1/marketplace/categories` - Get categories
- `GET /api/v1/marketplace/featured` - Get featured products

### Progress
- `GET /api/v1/progress/dashboard` - Get dashboard data
- `GET /api/v1/progress/history` - Get progress history
- `GET /api/v1/progress/stats` - Get detailed statistics
- `GET /api/v1/progress/charts` - Get chart data

### Subscriptions
- `GET /api/v1/subscription/status` - Get subscription status
- `POST /api/v1/subscription/create-checkout` - Create Stripe checkout
- `POST /api/v1/subscription/webhook` - Stripe webhook handler
- `POST /api/v1/subscription/cancel` - Cancel subscription

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License
