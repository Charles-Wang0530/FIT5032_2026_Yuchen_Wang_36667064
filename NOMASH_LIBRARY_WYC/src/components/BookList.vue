<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import db from '@/Firebase/init'

const books = ref([])
const errorMessage = ref('')
const isLoading = ref(true)

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const booksQuery = query(collection(db, 'books'), where('isbn', '>', 1000))
    const querySnapshot = await getDocs(booksQuery)

    books.value = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value = `${error.code}: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBooks)
</script>

<template>
  <section class="mt-5">
    <h2>Books with ISBN &gt; 1000</h2>
    <p v-if="isLoading">Loading books…</p>
    <p v-else-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <p v-else-if="!books.length" class="text-muted">No matching books found.</p>
    <ul v-else class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item">
        {{ book.name }} — ISBN: {{ book.isbn }}
      </li>
    </ul>
  </section>
</template>
