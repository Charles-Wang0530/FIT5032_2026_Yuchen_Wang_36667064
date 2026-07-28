<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const register = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const auth = getAuth()
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase registration successful.')
    router.push('/FireLogin')
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
        <h1 class="text-center mb-4">Create an Account</h1>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="register-email" class="form-label">Email</label>
            <input
              id="register-email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="register-password" class="form-label">Password</label>
            <input
              id="register-password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              minlength="6"
              required
            />
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating account…' : 'Save to Firebase' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
