<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const auth = getAuth()

const signIn = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase login successful.')
    console.log('Current Firebase user:', {
      uid: auth.currentUser?.uid,
      email: auth.currentUser?.email
    })
    router.push('/')
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
        <h1 class="text-center mb-4">Sign in</h1>
        <form @submit.prevent="signIn">
          <div class="mb-3">
            <label for="firebase-login-email" class="form-label">Email</label>
            <input
              id="firebase-login-email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="firebase-login-password" class="form-label">Password</label>
            <input
              id="firebase-login-password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in…' : 'Sign in via Firebase' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
