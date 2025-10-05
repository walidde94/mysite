<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <span class="text-3xl">🌱</span>
            <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              EcoStep
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-green-600 font-medium transition">
              Login
            </router-link>
            <router-link to="/register" class="btn-primary">
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Your Personal
            <span class="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              AI Climate Coach
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your carbon footprint, take on eco-challenges, and make a real difference for our planet 🌍
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link to="/register" class="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </router-link>
            <router-link to="/leaderboard" class="btn-secondary text-lg px-8 py-4">
              View Leaderboard
            </router-link>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div class="stat-card">
              <div class="text-4xl font-bold text-green-600">10K+</div>
              <div class="text-gray-600 mt-2">Active Users</div>
            </div>
            <div class="stat-card">
              <div class="text-4xl font-bold text-green-600">500T</div>
              <div class="text-gray-600 mt-2">CO₂ Saved</div>
            </div>
            <div class="stat-card">
              <div class="text-4xl font-bold text-green-600">50K+</div>
              <div class="text-gray-600 mt-2">Challenges Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12">Why Choose EcoStep?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="text-5xl mb-4">🌍</div>
            <h3 class="text-xl font-bold mb-2">AI Carbon Calculator</h3>
            <p class="text-gray-600">Get accurate carbon footprint estimates powered by AI</p>
          </div>
          <div class="card text-center">
            <div class="text-5xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-2">Personalized Challenges</h3>
            <p class="text-gray-600">Daily eco-challenges tailored to your lifestyle</p>
          </div>
          <div class="card text-center">
            <div class="text-5xl mb-4">📊</div>
            <h3 class="text-xl font-bold mb-2">Progress Tracking</h3>
            <p class="text-gray-600">Beautiful charts and insights to track your impact</p>
          </div>
          <div class="card text-center">
            <div class="text-5xl mb-4">🏆</div>
            <h3 class="text-xl font-bold mb-2">Global Leaderboard</h3>
            <p class="text-gray-600">Compete with eco-warriors worldwide</p>
          </div>
          <div class="card text-center">
            <div class="text-5xl mb-4">🛒</div>
            <h3 class="text-xl font-bold mb-2">Eco Marketplace</h3>
            <p class="text-gray-600">Shop sustainable products from trusted brands</p>
          </div>
          <div class="card text-center">
            <div class="text-5xl mb-4">💎</div>
            <h3 class="text-xl font-bold mb-2">Rewards & Badges</h3>
            <p class="text-gray-600">Earn points, unlock badges, and get premium rewards</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 class="font-bold mb-2">Sign Up</h3>
            <p class="text-gray-600">Create your free account in seconds</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 class="font-bold mb-2">Track Your Lifestyle</h3>
            <p class="text-gray-600">Enter your daily habits and activities</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 class="font-bold mb-2">Take Challenges</h3>
            <p class="text-gray-600">Complete personalized eco-challenges</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 class="font-bold mb-2">Make Impact</h3>
            <p class="text-gray-600">See your positive impact grow!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p class="text-xl mb-8 opacity-90">
          Join thousands of eco-warriors making the planet greener, one step at a time
        </p>
        <router-link to="/register" class="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-xl text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
          Get Started Free
        </router-link>
        <p class="mt-4 text-sm opacity-75">Premium features available for €2.99/month</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <span class="text-3xl">🌱</span>
          <span class="text-2xl font-bold">EcoStep</span>
        </div>
        <p class="text-gray-400 mb-6">Making sustainable living accessible to everyone</p>
        <div class="flex justify-center space-x-6 text-sm text-gray-400">
          <a href="#" class="hover:text-white transition">About</a>
          <a href="#" class="hover:text-white transition">Privacy</a>
          <a href="#" class="hover:text-white transition">Terms</a>
          <a href="#" class="hover:text-white transition">Contact</a>
        </div>
        <p class="mt-8 text-sm text-gray-500">© 2025 EcoStep. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Home page component
</script>
