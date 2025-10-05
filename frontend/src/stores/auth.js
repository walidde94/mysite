import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isPremium = computed(() => user.value?.isPremium || false)

  const checkAuth = async () => {
    if (token.value) {
      try {
        const response = await api.get('/auth/me')
        user.value = response.data.user
      } catch (err) {
        console.error('Auth check failed:', err)
        logout()
      }
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/register', userData)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/updateprofile', profileData)
      user.value = response.data.user
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Profile update failed'
      throw err
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isPremium,
    checkAuth,
    login,
    register,
    logout,
    updateProfile
  }
})
