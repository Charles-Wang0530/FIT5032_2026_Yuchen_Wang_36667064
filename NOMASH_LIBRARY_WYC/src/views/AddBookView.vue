<script setup>
import { ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import BookList from '@/components/BookList.vue'
import db from '@/Firebase/init'

const isbn = ref('')
const name = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)
const bookListKey = ref(0)

const addBook = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    const isbnNumber = Number(isbn.value)

    if (!Number.isFinite(isbnNumber)) {
      errorMessage.value = 'ISBN must be a valid number.'
      return
    }

    const document = await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value.trim(),
      createdAt: serverTimestamp()
    })

    successMessage.value = `Book saved to Firestore (ID: ${document.id}).`
    name.value = ''
    isbn.value = ''
    bookListKey.value += 1
  } catch (error) {
    console.error(error.code)
    errorMessage.value = `${error.code}: ${error.message}`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Add Book</h1>
        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label for="book-isbn" class="form-label">ISBN</label>
            <input
              id="book-isbn"
              v-model="isbn"
              type="number"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="book-name" class="form-label">Book name</label>
            <input id="book-name" v-model="name" class="form-control" required />
          </div>
          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving…' : 'Add Book' }}
          </button>
        </form>
        <BookList :key="bookListKey" />
      </div>
    </div>
  </div>
</template>
