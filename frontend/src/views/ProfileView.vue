<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600 mt-1">Manage your account and lifestyle preferences</p>
      </div>

      <!-- Profile Info -->
      <div class="card mb-6">
        <h3 class="text-xl font-bold mb-4">Profile Information</h3>
        <form @submit.prevent="updateProfile">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                v-model="profile.name"
                type="text"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profile.email"
                type="email"
                disabled
                class="input-field bg-gray-100"
              />
            </div>
            <button type="submit" :disabled="updateLoading" class="btn-primary">
              <span v-if="updateLoading">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Lifestyle Settings -->
      <div class="card mb-6">
        <h3 class="text-xl font-bold mb-4">Lifestyle Information</h3>
        <form @submit.prevent="updateLifestyle">
          <div class="space-y-6">
            <!-- Transportation -->
            <div>
              <h4 class="font-medium mb-3">🚗 Transportation</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Primary Mode</label>
                  <select v-model="lifestyle.transportation.primaryMode" class="input-field">
                    <option value="car">Car</option>
                    <option value="public_transport">Public Transport</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="walking">Walking</option>
                    <option value="electric_car">Electric Car</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Daily Distance (km)</label>
                  <input
                    v-model.number="lifestyle.transportation.distancePerDay"
                    type="number"
                    min="0"
                    class="input-field"
                  />
                </div>
              </div>
            </div>

            <!-- Energy -->
            <div>
              <h4 class="font-medium mb-3">⚡ Energy</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Daily Electricity (kWh)</label>
                  <input
                    v-model.number="lifestyle.energy.electricityUsage"
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Daily Gas (kWh)</label>
                  <input
                    v-model.number="lifestyle.energy.gasUsage"
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-field"
                  />
                </div>
              </div>
              <label class="flex items-center mt-3">
                <input
                  v-model="lifestyle.energy.renewableEnergy"
                  type="checkbox"
                  class="rounded text-green-600"
                />
                <span class="ml-2 text-sm text-gray-700">I use renewable energy</span>
              </label>
            </div>

            <!-- Diet -->
            <div>
              <h4 class="font-medium mb-3">🥗 Diet</h4>
              <select v-model="lifestyle.diet" class="input-field">
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="omnivore">Omnivore</option>
                <option value="high_meat">High Meat</option>
              </select>
            </div>

            <!-- Shopping -->
            <div>
              <h4 class="font-medium mb-3">🛍️ Shopping</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Clothes per Month</label>
                  <input
                    v-model.number="lifestyle.shopping.clothesPerMonth"
                    type="number"
                    min="0"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2">Electronics per Year</label>
                  <input
                    v-model.number="lifestyle.shopping.electronicsPerYear"
                    type="number"
                    min="0"
                    class="input-field"
                  />
                </div>
              </div>
            </div>

            <button type="submit" :disabled="lifestyleLoading" class="btn-primary">
              <span v-if="lifestyleLoading">Updating...</span>
              <span v-else>Update Lifestyle</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Account Stats -->
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Your Stats</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-3xl font-bold text-green-600">{{ authStore.user?.level }}</p>
            <p class="text-sm text-gray-600">Level</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-3xl font-bold text-blue-600">{{ authStore.user?.points }}</p>
            <p class="text-sm text-gray-600">Points</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <p class="text-3xl font-bold text-orange-600">{{ authStore.user?.streak?.current }}</p>
            <p class="text-sm text-gray-600">Streak</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-3xl font-bold text-purple-600">{{ authStore.user?.badges?.length || 0 }}</p>
            <p class="text-sm text-gray-600">Badges</p>
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

const updateLoading = ref(false)
const lifestyleLoading = ref(false)

const profile = ref({
  name: '',
  email: ''
})

const lifestyle = ref({
  transportation: {
    primaryMode: 'car',
    distancePerDay: 0
  },
  energy: {
    electricityUsage: 0,
    gasUsage: 0,
    renewableEnergy: false
  },
  diet: 'omnivore',
  shopping: {
    clothesPerMonth: 0,
    electronicsPerYear: 0
  }
})

const updateProfile = async () => {
  updateLoading.value = true
  try {
    await authStore.updateProfile({ name: profile.value.name })
    toast.success('Profile updated successfully!')
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    updateLoading.value = false
  }
}

const updateLifestyle = async () => {
  lifestyleLoading.value = true
  try {
    await api.put('/users/lifestyle', lifestyle.value)
    toast.success('Lifestyle updated successfully!')
  } catch (error) {
    toast.error('Failed to update lifestyle')
  } finally {
    lifestyleLoading.value = false
  }
}

onMounted(() => {
  if (authStore.user) {
    profile.value = {
      name: authStore.user.name,
      email: authStore.user.email
    }
    if (authStore.user.lifestyle) {
      lifestyle.value = { ...authStore.user.lifestyle }
    }
  }
})
</script>
