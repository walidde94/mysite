<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Challenge Detail -->
      <div v-else-if="challenge" class="space-y-6">
        <!-- Back Button -->
        <button @click="$router.back()" class="text-green-600 hover:text-green-700 font-medium">
          ← Back to Challenges
        </button>

        <!-- Challenge Card -->
        <div class="card-eco">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="text-6xl">{{ challenge.icon }}</div>
              <div>
                <h1 class="text-3xl font-bold mb-2">{{ challenge.title }}</h1>
                <div class="flex items-center space-x-2">
                  <span
                    :class="{
                      'badge badge-green': challenge.difficulty === 'easy',
                      'badge badge-yellow': challenge.difficulty === 'medium',
                      'badge badge-red': challenge.difficulty === 'hard'
                    }"
                  >
                    {{ challenge.difficulty }}
                  </span>
                  <span class="badge badge-blue">{{ challenge.category }}</span>
                </div>
              </div>
            </div>
            <div v-if="challenge.isPremium" class="badge bg-yellow-100 text-yellow-800">
              ⭐ Premium
            </div>
          </div>

          <p class="text-gray-700 text-lg mb-6">{{ challenge.description }}</p>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg p-4 text-center">
              <p class="text-sm text-gray-600">Duration</p>
              <p class="text-2xl font-bold text-gray-900">{{ challenge.duration }}</p>
              <p class="text-xs text-gray-500">days</p>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
              <p class="text-sm text-gray-600">Points</p>
              <p class="text-2xl font-bold text-blue-600">{{ challenge.points }}</p>
              <p class="text-xs text-gray-500">reward</p>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
              <p class="text-sm text-gray-600">CO₂ Saved</p>
              <p class="text-2xl font-bold text-green-600">{{ challenge.carbonSaved }}</p>
              <p class="text-xs text-gray-500">kg</p>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
              <p class="text-sm text-gray-600">Participants</p>
              <p class="text-2xl font-bold text-purple-600">{{ challenge.stats?.totalParticipants || 0 }}</p>
              <p class="text-xs text-gray-500">people</p>
            </div>
          </div>

          <!-- Tips -->
          <div v-if="challenge.tips?.length" class="bg-white rounded-lg p-6 mb-6">
            <h3 class="font-bold text-lg mb-4">💡 Tips for Success</h3>
            <ul class="space-y-2">
              <li v-for="(tip, index) in challenge.tips" :key="index" class="flex items-start">
                <span class="text-green-600 mr-2">✓</span>
                <span class="text-gray-700">{{ tip }}</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              v-if="!isStarted && !isCompleted"
              @click="startChallenge"
              :disabled="startLoading"
              class="flex-1 btn-primary disabled:opacity-50"
            >
              <span v-if="startLoading">Starting...</span>
              <span v-else>Start Challenge</span>
            </button>
            <button
              v-else-if="isStarted"
              @click="completeChallenge"
              :disabled="completeLoading"
              class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <span v-if="completeLoading">Completing...</span>
              <span v-else">Complete Challenge</span>
            </button>
            <button
              v-else-if="isCompleted"
              disabled
              class="flex-1 bg-gray-300 text-gray-600 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
            >
              ✓ Completed
            </button>
          </div>
        </div>

        <!-- Resources -->
        <div v-if="challenge.resources?.length" class="card">
          <h3 class="font-bold text-lg mb-4">📚 Resources</h3>
          <div class="space-y-3">
            <a
              v-for="(resource, index) in challenge.resources"
              :key="index"
              :href="resource.url"
              target="_blank"
              class="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">{{ resource.title }}</p>
                  <p class="text-sm text-gray-600">{{ resource.type }}</p>
                </div>
                <span class="text-green-600">→</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const startLoading = ref(false)
const completeLoading = ref(false)
const challenge = ref(null)

const isStarted = computed(() => {
  return authStore.user?.activeChallenges?.some(
    ac => ac.challengeId === challenge.value?._id
  )
})

const isCompleted = computed(() => {
  return authStore.user?.completedChallenges?.includes(challenge.value?._id)
})

const fetchChallenge = async () => {
  try {
    const response = await api.get(`/challenges/${route.params.id}`)
    challenge.value = response.data.challenge
  } catch (error) {
    console.error('Error fetching challenge:', error)
    toast.error('Failed to load challenge')
    router.push('/challenges')
  } finally {
    loading.value = false
  }
}

const startChallenge = async () => {
  startLoading.value = true
  try {
    await api.post(`/challenges/${challenge.value._id}/start`)
    toast.success('Challenge started! Good luck! 🎉')
    await authStore.checkAuth()
    router.push('/dashboard')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to start challenge')
  } finally {
    startLoading.value = false
  }
}

const completeChallenge = async () => {
  completeLoading.value = true
  try {
    const response = await api.post(`/challenges/${challenge.value._id}/complete`)
    toast.success(response.data.message || 'Challenge completed! 🎉')
    await authStore.checkAuth()
    router.push('/dashboard')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to complete challenge')
  } finally {
    completeLoading.value = false
  }
}

onMounted(() => {
  fetchChallenge()
})
</script>
