<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const route = useRoute()
const router = useRouter()

const handleLogin = () => {
  if (login(username.value, password.value)) {
    router.push(route.query.redirect || { name: 'about' })
  } else {
    errorMessage.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Library Member Login</h1>
        <div v-if="route.query.denied" class="alert alert-warning" role="alert">
          Access denied. Please log in to view that page.
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="login-username" class="form-label">Username</label>
            <input id="login-username" v-model="username" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
          <button type="submit" class="btn btn-primary">Log in</button>
        </form>
        <p class="text-muted mt-3 mb-0">Demo credentials: librarian / library123</p>
      </div>
    </div>
  </div>
</template>
