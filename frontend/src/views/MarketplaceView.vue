<template>
  <div class="min-h-screen pb-20">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🛒 Eco Marketplace</h1>
        <p class="text-gray-600 mt-1">Shop sustainable products from verified eco-friendly brands</p>
      </div>

      <!-- Filters -->
      <div class="card mb-8">
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select v-model="filters.category" class="input-field" @change="fetchProducts">
              <option value="">All Categories</option>
              <option value="fashion">👗 Fashion</option>
              <option value="food">🥗 Food</option>
              <option value="home">🏠 Home</option>
              <option value="electronics">📱 Electronics</option>
              <option value="beauty">💄 Beauty</option>
              <option value="sports">⚽ Sports</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select v-model="filters.sortBy" class="input-field" @change="fetchProducts">
              <option value="ecoScore">Eco Score</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div v-if="products.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="product in products" :key="product._id" class="card hover:scale-105 transition-transform cursor-pointer">
            <div class="relative mb-4">
              <img
                :src="product.images[0]?.url || 'https://via.placeholder.com/400x300'"
                :alt="product.name"
                class="w-full h-48 object-cover rounded-lg"
              />
              <div class="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ product.sustainability.ecoScore }}/100
              </div>
            </div>

            <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>

            <div class="flex items-center space-x-2 mb-3">
              <span
                v-for="cert in product.sustainability.certifications.slice(0, 3)"
                :key="cert.name"
                class="text-xl"
                :title="cert.name"
              >
                {{ cert.icon }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-2xl font-bold text-green-600">€{{ product.price.amount }}</p>
                <p class="text-xs text-gray-500">{{ product.brand.name }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Carbon: {{ product.sustainability.carbonFootprint }}kg</p>
              </div>
            </div>

            <button
              @click="trackAndVisit(product)"
              class="w-full btn-primary"
            >
              Shop Now →
            </button>
          </div>
        </div>
        <div v-else class="text-center py-20">
          <p class="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
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
const products = ref([])
const filters = ref({
  category: '',
  sortBy: 'ecoScore'
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.value.category) params.category = filters.value.category
    if (filters.value.sortBy) params.sortBy = filters.value.sortBy

    const response = await api.get('/marketplace/products', { params })
    products.value = response.data.products
  } catch (error) {
    console.error('Error fetching products:', error)
    toast.error('Failed to load products')
  } finally {
    loading.value = false
  }
}

const trackAndVisit = async (product) => {
  try {
    const response = await api.post(`/marketplace/products/${product._id}/click`)
    window.open(response.data.affiliateUrl, '_blank')
  } catch (error) {
    console.error('Error tracking click:', error)
    window.open(product.affiliate.url, '_blank')
  }
}

onMounted(() => {
  fetchProducts()
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
