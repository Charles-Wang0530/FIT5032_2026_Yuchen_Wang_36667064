<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { isSafeInternalPath } from '../utils/security'

const route = useRoute()
const router = useRouter()
const { login, register } = useAuth()

const mode = ref('login')
const submitting = ref(false)
const formError = ref('')
const errors = ref({})

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({
  name: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: '',
  consent: false,
})

const passwordChecks = computed(() => ({
  length: registerForm.password.length >= 8,
  upper: /[A-Z]/.test(registerForm.password),
  lower: /[a-z]/.test(registerForm.password),
  number: /\d/.test(registerForm.password),
}))

function switchMode(nextMode) {
  mode.value = nextMode
  errors.value = {}
  formError.value = ''
}

function validateLogin() {
  const nextErrors = {}
  if (!loginForm.email.trim()) nextErrors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(loginForm.email)) nextErrors.email = 'Enter a valid email address.'
  if (!loginForm.password) nextErrors.password = 'Enter your password.'
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function validateRegistration() {
  const nextErrors = {}
  const cleanName = registerForm.name.trim()
  const cleanEmail = registerForm.email.trim()

  if (!cleanName) nextErrors.name = 'Enter your full name.'
  else if (cleanName.length < 2 || cleanName.length > 60) nextErrors.name = 'Name must be between 2 and 60 characters.'
  else if (!/^[\p{L}\p{M} .'-]+$/u.test(cleanName)) nextErrors.name = 'Name can only contain letters, spaces, apostrophes and hyphens.'

  if (!cleanEmail) nextErrors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleanEmail)) nextErrors.email = 'Enter a valid email address.'

  if (!Object.values(passwordChecks.value).every(Boolean)) nextErrors.password = 'Password must satisfy all four requirements.'
  if (!registerForm.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.'
  else if (registerForm.confirmPassword !== registerForm.password) nextErrors.confirmPassword = 'Passwords do not match.'
  if (!registerForm.consent) nextErrors.consent = 'Confirm that you agree to store this demo account on this device.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

async function finishAuthentication(user) {
  const requestedPath = typeof route.query.redirect === 'string' && isSafeInternalPath(route.query.redirect)
    ? route.query.redirect
    : null
  await router.push(requestedPath || (user.role === 'admin' ? '/admin' : '/dashboard'))
}

async function submitLogin() {
  formError.value = ''
  if (!validateLogin()) return
  submitting.value = true
  const result = await login(loginForm.email, loginForm.password)
  submitting.value = false
  if (!result.ok) {
    formError.value = result.message
    return
  }
  await finishAuthentication(result.user)
}

async function submitRegistration() {
  formError.value = ''
  if (!validateRegistration()) return
  submitting.value = true
  const result = await register(registerForm)
  submitting.value = false
  if (!result.ok) {
    formError.value = result.message
    return
  }
  await finishAuthentication(result.user)
}
</script>

<template>
  <section class="account-page">
    <div class="account-art">
      <div>
        <p class="eyebrow">YOUR PRIVATE SPACE</p>
        <h1>Keep useful support close.</h1>
        <p>Save resources, manage event bookings and see recommendations made for your role.</p>
        <div class="account-face" aria-hidden="true">☺</div>
        <div class="demo-accounts">
          <strong>Marker demo accounts</strong>
          <span>User: user@mindbridge.test / User123!</span>
          <span>Family: family@mindbridge.test / Family123!</span>
          <span>Admin: admin@mindbridge.test / Admin123!</span>
        </div>
      </div>
    </div>

    <div class="account-panel">
      <div class="account-form">
        <div class="auth-tabs" role="tablist" aria-label="Account options">
          <button type="button" role="tab" :aria-selected="mode === 'login'" @click="switchMode('login')">Sign in</button>
          <button type="button" role="tab" :aria-selected="mode === 'register'" @click="switchMode('register')">Create account</button>
        </div>

        <form v-if="mode === 'login'" novalidate @submit.prevent="submitLogin">
          <p class="eyebrow">WELCOME BACK</p>
          <h2>Sign in to MindBridge</h2>
          <p>Access your saved support and role-specific dashboard.</p>

          <label for="login-email">Email address</label>
          <input id="login-email" v-model.trim="loginForm.email" type="email" maxlength="100" autocomplete="email" :aria-invalid="Boolean(errors.email)" aria-describedby="login-email-error" />
          <p v-if="errors.email" id="login-email-error" class="field-error" role="alert">{{ errors.email }}</p>

          <label for="login-password">Password</label>
          <input id="login-password" v-model="loginForm.password" type="password" maxlength="128" autocomplete="current-password" :aria-invalid="Boolean(errors.password)" aria-describedby="login-password-error" />
          <p v-if="errors.password" id="login-password-error" class="field-error" role="alert">{{ errors.password }}</p>

          <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
          <button class="button button--blue button--full" type="submit" :disabled="submitting">{{ submitting ? 'Signing in…' : 'Sign in' }}</button>
          <p class="account-switch">New to MindBridge? <button type="button" @click="switchMode('register')">Create an account</button></p>
        </form>

        <form v-else novalidate @submit.prevent="submitRegistration">
          <p class="eyebrow">JOIN MINDBRIDGE</p>
          <h2>Create your account</h2>
          <p>Choose the account experience that best matches how you use MindBridge.</p>

          <label for="register-name">Full name</label>
          <input id="register-name" v-model="registerForm.name" type="text" maxlength="60" autocomplete="name" :aria-invalid="Boolean(errors.name)" aria-describedby="register-name-error" />
          <p v-if="errors.name" id="register-name-error" class="field-error" role="alert">{{ errors.name }}</p>

          <label for="register-email">Email address</label>
          <input id="register-email" v-model.trim="registerForm.email" type="email" maxlength="100" autocomplete="email" :aria-invalid="Boolean(errors.email)" aria-describedby="register-email-error" />
          <p v-if="errors.email" id="register-email-error" class="field-error" role="alert">{{ errors.email }}</p>

          <fieldset class="role-options">
            <legend>Account type</legend>
            <label :class="{ selected: registerForm.role === 'user' }"><input v-model="registerForm.role" type="radio" value="user" />Individual user</label>
            <label :class="{ selected: registerForm.role === 'family' }"><input v-model="registerForm.role" type="radio" value="family" />Family supporter</label>
          </fieldset>

          <label for="register-password">Password</label>
          <input id="register-password" v-model="registerForm.password" type="password" maxlength="128" autocomplete="new-password" :aria-invalid="Boolean(errors.password)" aria-describedby="password-rules register-password-error" />
          <ul id="password-rules" class="password-rules">
            <li :class="{ passed: passwordChecks.length }">8 or more characters</li>
            <li :class="{ passed: passwordChecks.upper }">One uppercase letter</li>
            <li :class="{ passed: passwordChecks.lower }">One lowercase letter</li>
            <li :class="{ passed: passwordChecks.number }">One number</li>
          </ul>
          <p v-if="errors.password" id="register-password-error" class="field-error" role="alert">{{ errors.password }}</p>

          <label for="register-confirm">Confirm password</label>
          <input id="register-confirm" v-model="registerForm.confirmPassword" type="password" maxlength="128" autocomplete="new-password" :aria-invalid="Boolean(errors.confirmPassword)" aria-describedby="register-confirm-error" />
          <p v-if="errors.confirmPassword" id="register-confirm-error" class="field-error" role="alert">{{ errors.confirmPassword }}</p>

          <label class="consent-row">
            <input v-model="registerForm.consent" type="checkbox" />
            <span>I agree to store this learning-project account on this device.</span>
          </label>
          <p v-if="errors.consent" class="field-error" role="alert">{{ errors.consent }}</p>
          <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

          <button class="button button--blue button--full" type="submit" :disabled="submitting">{{ submitting ? 'Creating account…' : 'Create account' }}</button>
          <p class="account-switch">Already registered? <button type="button" @click="switchMode('login')">Sign in</button></p>
        </form>
      </div>
    </div>
  </section>
</template>
