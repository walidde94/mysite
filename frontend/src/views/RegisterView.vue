<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-6">
          <span class="text-4xl">🌱</span>
          <span class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            EcoStep
          </span>
        </router-link>
        <h2 class="text-3xl font-bold text-gray-900">Start Your Journey</h2>
        <p class="text-gray-600 mt-2">Join thousands making a difference</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="input-field"
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">At least 8 characters</p>
            </div>

            <div class="flex items-start">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
                required
                class="rounded text-green-600 focus:ring-green-500 mt-1"
              />
              <label class="ml-2 text-sm text-gray-600">
                I agree to the
                <a href="#" class="text-green-600 hover:text-green-700">Terms of Service</a>
                and
                <a href="#" class="text-green-600 hover:text-green-700">Privacy Policy</a>
              </label>
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Creating account...</span>
              <span v-else">Create Account</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-green-600 font-medium hover:text-green-700">
              Login
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  name: '',
  email: '',
  password: '',
  agreeToTerms: false
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
  loading.value = true
  error.value = null

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    toast.success('Welcome to EcoStep! 🎉')
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
