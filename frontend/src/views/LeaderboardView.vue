<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
        <p class="text-gray-600">See how you rank among eco-warriors worldwide</p>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex bg-white rounded-xl p-1 shadow-md">
          <button
            @click="activeTab = 'global'"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition',
              activeTab === 'global'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-green-600'
            ]"
          >
            Global
          </button>
          <button
            @click="activeTab = 'weekly'"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition',
              activeTab === 'weekly'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-green-600'
            ]"
          >
            This Week
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Leaderboard -->
      <div v-else class="card">
        <!-- Top 3 Podium -->
        <div v-if="leaderboard.length >= 3" class="flex justify-center items-end mb-8 space-x-4">
          <!-- 2nd Place -->
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-2">
              {{ leaderboard[1]?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="text-4xl mb-2">🥈</div>
            <p class="font-bold">{{ leaderboard[1]?.name }}</p>
            <p class="text-sm text-gray-600">{{ leaderboard[1]?.points }} pts</p>
          </div>

          <!-- 1st Place -->
          <div class="text-center">
            <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-2 animate-pulse-slow">
              {{ leaderboard[0]?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="text-5xl mb-2">🥇</div>
            <p class="font-bold text-lg">{{ leaderboard[0]?.name }}</p>
            <p class="text-sm text-green-600 font-semibold">{{ leaderboard[0]?.points }} pts</p>
          </div>

          <!-- 3rd Place -->
          <div class="text-center">
            <div class="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-2">
              {{ leaderboard[2]?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="text-4xl mb-2">🥉</div>
            <p class="font-bold">{{ leaderboard[2]?.name }}</p>
            <p class="text-sm text-gray-600">{{ leaderboard[2]?.points }} pts</p>
          </div>
        </div>

        <!-- Rest of Leaderboard -->
        <div class="space-y-2">
          <div
            v-for="(entry, index) in leaderboard.slice(3)"
            :key="entry.userId"
            :class="[
              'flex items-center justify-between p-4 rounded-lg transition',
              entry.userId === authStore.user?._id
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-gray-50 hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center space-x-4">
              <div class="w-8 text-center font-bold text-gray-600">
                #{{ index + 4 }}
              </div>
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ entry.name?.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-medium">
                  {{ entry.name }}
                  <span v-if="entry.userId === authStore.user?._id" class="text-green-600 text-sm ml-2">
                    (You)
                  </span>
                </p>
                <div class="flex items-center space-x-3 text-sm text-gray-600">
                  <span>Level {{ entry.level }}</span>
                  <span v-if="entry.streak">🔥 {{ entry.streak }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-green-600">{{ entry.points || entry.weeklyPoints }}</p>
              <p class="text-xs text-gray-500">points</p>
            </div>
          </div>
        </div>

        <!-- User Rank (if not in top list) -->
        <div v-if="userRank && userRank > 100" class="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
          <p class="text-center font-medium">
            You're ranked <span class="font-bold text-blue-600">#{{ userRank }}</span> globally!
            Keep challenging yourself to climb higher 🚀
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const activeTab = ref('global')
const leaderboard = ref([])
const userRank = ref(null)

const fetchLeaderboard = async () => {
  loading.value = true
  try {
    const endpoint = activeTab.value === 'global' ? '/leaderboard/global' : '/leaderboard/weekly'
    const response = await api.get(endpoint)
    leaderboard.value = response.data.leaderboard
    userRank.value = response.data.userRank
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    toast.error('Failed to load leaderboard')
  } finally {
    loading.value = false
  }
}

watch(activeTab, () => {
  fetchLeaderboard()
})

onMounted(() => {
  fetchLeaderboard()
})
</script>
