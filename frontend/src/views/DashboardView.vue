<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ authStore.user?.name }}! 👋
        </h1>
        <p class="text-gray-600 mt-1">Here's your eco-impact today</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Level</p>
                <p class="text-3xl font-bold text-green-600">{{ dashboard.user?.level || 1 }}</p>
              </div>
              <div class="text-4xl">🏆</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Points</p>
                <p class="text-3xl font-bold text-blue-600">{{ dashboard.user?.points || 0 }}</p>
              </div>
              <div class="text-4xl">⭐</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Streak</p>
                <p class="text-3xl font-bold text-orange-600">{{ dashboard.user?.streak?.current || 0 }}</p>
              </div>
              <div class="text-4xl">🔥</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Today's CO₂</p>
                <p class="text-3xl font-bold text-red-600">{{ dashboard.today?.carbonFootprint?.toFixed(1) || 0 }}</p>
              </div>
              <div class="text-4xl">🌍</div>
            </div>
          </div>
        </div>

        <!-- Carbon Footprint & Weekly Progress -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Carbon Breakdown -->
          <div class="card">
            <h3 class="text-xl font-bold mb-4">Carbon Footprint Breakdown</h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>🚗 Transportation</span>
                  <span class="font-medium">{{ dashboard.carbonFootprint?.breakdown?.transportation || 0 }}kg</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" :style="{ width: '40%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>⚡ Energy</span>
                  <span class="font-medium">{{ dashboard.carbonFootprint?.breakdown?.energy || 0 }}kg</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: '30%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>🍽️ Diet</span>
                  <span class="font-medium">{{ dashboard.carbonFootprint?.breakdown?.diet || 0 }}kg</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: '20%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>🛍️ Shopping</span>
                  <span class="font-medium">{{ dashboard.carbonFootprint?.breakdown?.shopping || 0 }}kg</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" :style="{ width: '10%' }"></div>
                </div>
              </div>
            </div>
            <button @click="calculateFootprint" class="mt-4 w-full btn-primary">
              Recalculate Footprint
            </button>
          </div>

          <!-- Weekly Progress -->
          <div class="card">
            <h3 class="text-xl font-bold mb-4">This Week's Progress</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-600">Challenges Completed</p>
                  <p class="text-2xl font-bold text-green-600">{{ dashboard.thisWeek?.challengesCompleted || 0 }}</p>
                </div>
                <div class="text-3xl">✅</div>
              </div>
              <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-600">Points Earned</p>
                  <p class="text-2xl font-bold text-blue-600">{{ dashboard.thisWeek?.totalPoints || 0 }}</p>
                </div>
                <div class="text-3xl">⭐</div>
              </div>
              <div class="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-600">Avg Daily CO₂</p>
                  <p class="text-2xl font-bold text-orange-600">{{ dashboard.thisWeek?.averageDaily?.toFixed(1) || 0 }}kg</p>
                </div>
                <div class="text-3xl">📊</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Challenges -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Today's Challenges</h3>
            <router-link to="/challenges" class="text-green-600 hover:text-green-700 font-medium">
              View All →
            </router-link>
          </div>
          <div v-if="dashboard.dailyChallenges?.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="challenge in dashboard.dailyChallenges"
              :key="challenge._id"
              class="card-eco cursor-pointer hover:scale-105 transition-transform"
              @click="$router.push(`/challenges/${challenge._id}`)"
            >
              <div class="text-4xl mb-2">{{ challenge.icon }}</div>
              <h4 class="font-bold mb-2">{{ challenge.title }}</h4>
              <p class="text-sm text-gray-600 mb-3">{{ challenge.description.substring(0, 80) }}...</p>
              <div class="flex items-center justify-between text-sm">
                <span class="badge badge-green">+{{ challenge.points }} pts</span>
                <span class="text-gray-600">{{ challenge.carbonSaved }}kg CO₂</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <p>No challenges available. Check back tomorrow!</p>
          </div>
        </div>

        <!-- Active Challenges -->
        <div v-if="dashboard.activeChallenges?.length" class="card">
          <h3 class="text-xl font-bold mb-4">Active Challenges</h3>
          <div class="space-y-3">
            <div
              v-for="active in dashboard.activeChallenges"
              :key="active.challengeId._id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{{ active.challengeId.icon }}</span>
                <div>
                  <p class="font-medium">{{ active.challengeId.title }}</p>
                  <p class="text-sm text-gray-600">{{ active.progress }}% complete</p>
                </div>
              </div>
              <button class="btn-primary text-sm">Continue</button>
            </div>
          </div>
        </div>

        <!-- Recent Badges -->
        <div v-if="dashboard.recentBadges?.length" class="card">
          <h3 class="text-xl font-bold mb-4">Recent Badges</h3>
          <div class="flex space-x-4 overflow-x-auto">
            <div
              v-for="badge in dashboard.recentBadges"
              :key="badge.name"
              class="flex-shrink-0 text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
            >
              <div class="text-4xl mb-2">{{ badge.icon }}</div>
              <p class="font-medium text-sm">{{ badge.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const dashboard = ref({})

const fetchDashboard = async () => {
  try {
    const response = await api.get('/progress/dashboard')
    dashboard.value = response.data.dashboard
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const calculateFootprint = async () => {
  try {
    await api.post('/carbon/calculate')
    toast.success('Carbon footprint calculated!')
    fetchDashboard()
  } catch (error) {
    toast.error('Failed to calculate footprint')
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>
