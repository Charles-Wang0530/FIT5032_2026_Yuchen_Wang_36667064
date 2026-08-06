<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { firebaseConfigured, register, sendPasswordReset, signIn, signInWithGoogle } = useAuth()

const mode = ref('signin')
const submitting = ref(false)
const message = ref('')
const messageType = ref('error')
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })

const title = computed(() => mode.value === 'register' ? 'Create your MindBridge account' : 'Sign in to MindBridge')
const destination = computed(() => typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard')

function setMode(nextMode) {
  mode.value = nextMode
  message.value = ''
  form.password = ''
  form.confirmPassword = ''
}

function validate() {
  if (!form.email.trim()) return 'Enter your email address.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address.'
  if (form.password.length < 6) return 'Password must contain at least six characters.'
  if (mode.value === 'register' && form.name.trim().length < 2) return 'Enter your name.'
  if (mode.value === 'register' && form.password !== form.confirmPassword) return 'The passwords do not match.'
  return ''
}

async function submit() {
  message.value = validate()
  messageType.value = 'error'
  if (message.value) return

  submitting.value = true
  try {
    if (mode.value === 'register') await register(form)
    else await signIn(form.email, form.password)
    await router.push(destination.value)
  } catch (error) {
    message.value = error.message
  } finally {
    submitting.value = false
  }
}

async function googleSignIn() {
  message.value = ''
  submitting.value = true
  try {
    await signInWithGoogle()
    await router.push(destination.value)
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

async function resetPassword() {
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    message.value = 'Enter your email address first, then choose Forgot password.'
    messageType.value = 'error'
    return
  }
  submitting.value = true
  try {
    await sendPasswordReset(form.email)
    message.value = 'Password reset instructions have been sent to your email.'
    messageType.value = 'success'
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="account-page">
    <div class="account-art">
      <div>
        <p class="eyebrow">YOUR PRIVATE SPACE</p>
        <h1>Keep useful support close.</h1>
        <p>Save resources, manage event bookings and see recommendations made for you.</p>
        <div class="account-face" aria-hidden="true">☺</div>
      </div>
    </div>
    <div class="account-panel">
      <form class="account-form" novalidate @submit.prevent="submit">
        <p class="eyebrow">{{ mode === 'register' ? 'JOIN MINDBRIDGE' : 'WELCOME BACK' }}</p>
        <h2>{{ title }}</h2>
        <p>Authentication is securely provided by Firebase.</p>

        <div v-if="!firebaseConfigured" class="auth-config-note" role="status">
          Firebase setup is required before authentication can be used. Add the project values to your local <code>.env</code> file.
        </div>

        <div class="account-tabs" aria-label="Account action">
          <button type="button" :class="{ selected: mode === 'signin' }" :aria-pressed="mode === 'signin'" @click="setMode('signin')">Sign in</button>
          <button type="button" :class="{ selected: mode === 'register' }" :aria-pressed="mode === 'register'" @click="setMode('register')">Create account</button>
        </div>

        <label v-if="mode === 'register'">Name<input v-model.trim="form.name" type="text" autocomplete="name" placeholder="Your name" /></label>
        <label>Email address<input v-model.trim="form.email" type="email" autocomplete="email" placeholder="you@example.com" /></label>
        <label>Password<input v-model="form.password" type="password" :autocomplete="mode === 'register' ? 'new-password' : 'current-password'" placeholder="At least 6 characters" /></label>
        <label v-if="mode === 'register'">Confirm password<input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Enter your password again" /></label>

        <p v-if="message" class="auth-message" :class="`auth-message--${messageType}`" role="alert" aria-live="assertive">{{ message }}</p>

        <button class="button button--blue button--full" type="submit" :disabled="submitting || !firebaseConfigured">
          {{ submitting ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Sign in') }}
        </button>
        <button v-if="mode === 'signin'" class="text-button" type="button" :disabled="submitting || !firebaseConfigured" @click="resetPassword">Forgot password?</button>

        <div class="account-divider"><span>or</span></div>
        <button class="button button--google button--full" type="button" :disabled="submitting || !firebaseConfigured" @click="googleSignIn">
          <span aria-hidden="true">G</span> Continue with Google
        </button>
      </form>
    </div>
  </section>
</template>
