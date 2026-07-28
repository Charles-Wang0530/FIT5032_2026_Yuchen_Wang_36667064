<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import db from '@/Firebase/init'

const apiResponse = ref(null)
const loading = ref(false)
const error = ref('')

const getAllBookData = async () => {
  loading.value = true
  error.value = ''

  try {
    const snapshot = await getDocs(collection(db, 'books'))
    const books = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
    apiResponse.value = {
      success: true,
      data: { totalBooks: books.length, books },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `${err.code ?? 'Error'}: ${err.message}`
    console.error('Error loading books:', err)
  } finally {
    loading.value = false
  }
}

onMounted(getAllBookData)
defineExpose({ getAllBookData })
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Get All Book API</h1>
    <p v-if="loading">Loading books…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <div v-else-if="apiResponse" class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.api-response pre { white-space: pre-wrap; }
</style>
