<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/dashboard" class="flex items-center space-x-2">
          <span class="text-3xl">🌱</span>
          <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            EcoStep
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/dashboard"
            class="text-gray-700 hover:text-green-600 font-medium transition"
            active-class="text-green-600"
          >
            Dashboard
          </router-link>
          <router-link
            to="/challenges"
            class="text-gray-700 hover:text-green-600 font-medium transition"
            active-class="text-green-600"
          >
            Challenges
          </router-link>
          <router-link
            to="/leaderboard"
            class="text-gray-700 hover:text-green-600 font-medium transition"
            active-class="text-green-600"
          >
            Leaderboard
          </router-link>
          <router-link
            to="/marketplace"
            class="text-gray-700 hover:text-green-600 font-medium transition"
            active-class="text-green-600"
          >
            Marketplace
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <router-link
            v-if="!authStore.isPremium"
            to="/subscription"
            class="hidden md:block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg text-sm hover:shadow-lg transition"
          >
            ⭐ Upgrade
          </router-link>
          
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden md:block font-medium">{{ authStore.user?.name }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Profile
              </router-link>
              <router-link
                to="/subscription"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Subscription
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showUserMenu = ref(false)

const handleLogout = () => {
  authStore.logout()
  toast.info('Logged out successfully')
  router.push('/')
}
</script>
