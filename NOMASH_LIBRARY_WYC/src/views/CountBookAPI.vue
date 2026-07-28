<script setup>
import { onMounted, ref } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)
const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => total + author.famousWorks.length, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(new URL('../assets/json/authors.json', import.meta.url))

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    authors.value = await response.json()
    calculateStats()

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map((author) => ({
          name: author.name,
          bookCount: author.famousWorks.length
        }))
      },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(getApiData)

defineExpose({ getApiData })
</script>

<template>
  <div class="container mt-5">
    <p v-if="loading">Loading author data…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <div v-else-if="apiResponse" class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.api-response pre {
  white-space: pre-wrap;
}
</style>
