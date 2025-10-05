<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Eco Challenges</h1>
        <p class="text-gray-600 mt-1">Take on challenges to reduce your carbon footprint</p>
      </div>

      <!-- Filters -->
      <div class="card mb-8">
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select v-model="filters.category" class="input-field" @change="fetchChallenges">
              <option value="">All Categories</option>
              <option value="transportation">🚗 Transportation</option>
              <option value="energy">⚡ Energy</option>
              <option value="diet">🥗 Diet</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="water">💧 Water</option>
              <option value="waste">♻️ Waste</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select v-model="filters.difficulty" class="input-field" @change="fetchChallenges">
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Challenges Grid -->
      <div v-else>
        <div v-if="challenges.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="challenge in challenges"
            :key="challenge._id"
            class="card-eco cursor-pointer hover:scale-105 transition-transform"
            @click="$router.push(`/challenges/${challenge._id}`)"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="text-5xl">{{ challenge.icon }}</div>
              <span
                :class="{
                  'badge badge-green': challenge.difficulty === 'easy',
                  'badge badge-yellow': challenge.difficulty === 'medium',
                  'badge badge-red': challenge.difficulty === 'hard'
                }"
              >
                {{ challenge.difficulty }}
              </span>
            </div>

            <h3 class="text-xl font-bold mb-2">{{ challenge.title }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ challenge.description }}</p>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">⏱️ Duration</span>
                <span class="font-medium">{{ challenge.duration }} day(s)</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">⭐ Points</span>
                <span class="font-medium text-blue-600">{{ challenge.points }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">🌍 CO₂ Saved</span>
                <span class="font-medium text-green-600">{{ challenge.carbonSaved }}kg</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">👥 Participants</span>
                <span class="font-medium">{{ challenge.stats?.totalParticipants || 0 }}</span>
              </div>
            </div>

            <div v-if="challenge.isPremium" class="mt-4 flex items-center justify-center py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <span class="text-sm font-medium text-yellow-800">⭐ Premium Challenge</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20">
          <p class="text-gray-500 text-lg">No challenges found. Try adjusting your filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const toast = useToast()

const loading = ref(true)
const challenges = ref([])
const filters = ref({
  category: '',
  difficulty: ''
})

const fetchChallenges = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.value.category) params.category = filters.value.category
    if (filters.value.difficulty) params.difficulty = filters.value.difficulty

    const response = await api.get('/challenges', { params })
    challenges.value = response.data.challenges
  } catch (error) {
    console.error('Error fetching challenges:', error)
    toast.error('Failed to load challenges')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChallenges()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
