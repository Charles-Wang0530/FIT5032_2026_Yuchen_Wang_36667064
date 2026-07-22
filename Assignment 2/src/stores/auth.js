import { computed, readonly, ref } from 'vue'
import { readStorage, writeStorage } from '../utils/storage.js'

const USERS_KEY = 'mindbridge:users'
const SESSION_KEY = 'mindbridge:session'
const ALLOWED_ROLES = ['user', 'family', 'admin']

const demoAccounts = [
  { name: 'David Tao', email: 'user@mindbridge.test', password: 'User123!', role: 'user' },
  { name: 'Maria Williams', email: 'family@mindbridge.test', password: 'Family123!', role: 'family' },
  { name: 'Alex Morgan', email: 'admin@mindbridge.test', password: 'Admin123!', role: 'admin' },
]

const users = ref([])
const currentUser = ref(null)
const authReady = ref(false)

const isAuthenticated = computed(() => Boolean(currentUser.value))
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const publicUsers = computed(() => users.value.map(toPublicUser))

function normaliseEmail(email) {
  return String(email).trim().toLocaleLowerCase()
}

function toPublicUser(user) {
  if (!user) return null
  const { passwordHash: _passwordHash, salt: _salt, ...safeUser } = user
  return safeUser
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const payload = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function createUserRecord({ name, email, password, role }) {
  const salt = createSalt()
  return {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normaliseEmail(email),
    role: ALLOWED_ROLES.includes(role) ? role : 'user',
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  }
}

async function ensureDemoAccounts() {
  let changed = false

  for (const account of demoAccounts) {
    if (!users.value.some((user) => user.email === account.email)) {
      users.value.push(await createUserRecord(account))
      changed = true
    }
  }

  if (changed) writeStorage(USERS_KEY, users.value)
}

export async function initializeAuth() {
  users.value = readStorage(USERS_KEY, [])
  if (!Array.isArray(users.value)) users.value = []
  await ensureDemoAccounts()

  const session = readStorage(SESSION_KEY, null)
  const activeUser = session?.userId ? users.value.find((user) => user.id === session.userId) : null
  currentUser.value = toPublicUser(activeUser)
  authReady.value = true
}

export async function login(email, password) {
  const account = users.value.find((user) => user.email === normaliseEmail(email))
  if (!account) return { ok: false, message: 'Email or password is incorrect.' }

  const candidateHash = await hashPassword(password, account.salt)
  if (candidateHash !== account.passwordHash) return { ok: false, message: 'Email or password is incorrect.' }

  currentUser.value = toPublicUser(account)
  writeStorage(SESSION_KEY, { userId: account.id, signedInAt: new Date().toISOString() })
  return { ok: true, user: currentUser.value }
}

export async function register({ name, email, password, role }) {
  const cleanEmail = normaliseEmail(email)
  if (users.value.some((user) => user.email === cleanEmail)) {
    return { ok: false, message: 'An account with this email already exists.' }
  }

  const safeRole = role === 'family' ? 'family' : 'user'
  const account = await createUserRecord({ name, email: cleanEmail, password, role: safeRole })
  users.value.push(account)
  writeStorage(USERS_KEY, users.value)
  currentUser.value = toPublicUser(account)
  writeStorage(SESSION_KEY, { userId: account.id, signedInAt: new Date().toISOString() })
  return { ok: true, user: currentUser.value }
}

export function logout() {
  currentUser.value = null
  window.localStorage.removeItem(SESSION_KEY)
}

export function hasRole(roles) {
  return Boolean(currentUser.value && roles.includes(currentUser.value.role))
}

export function updateUserRole(userId, role) {
  if (!isAdmin.value || !ALLOWED_ROLES.includes(role) || userId === currentUser.value.id) return false
  const account = users.value.find((user) => user.id === userId)
  if (!account) return false
  account.role = role
  writeStorage(USERS_KEY, users.value)
  return true
}

export function useAuth() {
  return {
    authReady: readonly(authReady),
    currentUser: readonly(currentUser),
    isAuthenticated,
    isAdmin,
    publicUsers,
    login,
    register,
    logout,
    hasRole,
    updateUserRole,
  }
}
