<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">⭐ Go Premium</h1>
        <p class="text-gray-600">Unlock advanced AI analytics and exclusive rewards</p>
      </div>

      <!-- Current Status -->
      <div v-if="authStore.isPremium" class="card mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Premium Member</h3>
            <p class="text-gray-600">You have access to all premium features!</p>
          </div>
          <div class="text-5xl">👑</div>
        </div>
      </div>

      <!-- Pricing -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Free Plan -->
        <div class="card border-2 border-gray-200">
          <h3 class="text-2xl font-bold mb-4">Free</h3>
          <p class="text-4xl font-bold mb-6">€0<span class="text-lg text-gray-600">/month</span></p>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Basic carbon footprint calculator</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Access to free challenges</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Progress dashboard</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Global leaderboard</span>
            </li>
            <li class="flex items-start">
              <span class="text-gray-400 mr-2">✗</span>
              <span class="text-gray-400">AI-powered insights</span>
            </li>
            <li class="flex items-start">
              <span class="text-gray-400 mr-2">✗</span>
              <span class="text-gray-400">Premium challenges</span>
            </li>
          </ul>
          <button disabled class="w-full bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
            Current Plan
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="card border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white relative">
          <div class="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            POPULAR
          </div>
          <h3 class="text-2xl font-bold mb-4">Premium</h3>
          <p class="text-4xl font-bold mb-6">€2.99<span class="text-lg text-gray-600">/month</span></p>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span class="font-medium">Everything in Free, plus:</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Advanced AI insights & recommendations</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Access to all premium challenges</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Detailed analytics & reports</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Priority support</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>Exclusive marketplace discounts</span>
            </li>
          </ul>
          <button
            v-if="!authStore.isPremium"
            @click="createCheckoutSession"
            :disabled="checkoutLoading"
            class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            <span v-if="checkoutLoading">Loading...</span>
            <span v-else>Upgrade Now</span>
          </button>
          <button v-else disabled class="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl">
            ✓ Active
          </button>
        </div>
      </div>

      <!-- Features Showcase -->
      <div class="card">
        <h3 class="text-2xl font-bold mb-6 text-center">Why Go Premium?</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-5xl mb-3">🤖</div>
            <h4 class="font-bold mb-2">AI-Powered Insights</h4>
            <p class="text-sm text-gray-600">Get personalized recommendations based on your lifestyle</p>
          </div>
          <div class="text-center">
            <div class="text-5xl mb-3">🏆</div>
            <h4 class="font-bold mb-2">Exclusive Challenges</h4>
            <p class="text-sm text-gray-600">Access premium challenges with higher rewards</p>
          </div>
          <div class="text-center">
            <div class="text-5xl mb-3">📊</div>
            <h4 class="font-bold mb-2">Advanced Analytics</h4>
            <p class="text-sm text-gray-600">Detailed reports and trend analysis</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()
const toast = useToast()

const checkoutLoading = ref(false)

const createCheckoutSession = async () => {
  checkoutLoading.value = true
  try {
    const response = await api.post('/subscription/create-checkout')
    window.location.href = response.data.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    toast.error('Failed to start checkout process')
    checkoutLoading.value = false
  }
}
</script>
