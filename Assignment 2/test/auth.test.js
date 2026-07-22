import assert from 'node:assert/strict'
import test from 'node:test'

function createLocalStorage() {
  const values = new Map()
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
    clear() {
      values.clear()
    },
  }
}

globalThis.window = { localStorage: createLocalStorage() }

const auth = await import('../src/stores/auth.js')

test('seeds multiple accounts without exposing password hashes', async () => {
  await auth.initializeAuth()
  const { publicUsers } = auth.useAuth()

  assert.equal(publicUsers.value.length, 3)
  assert.deepEqual(
    new Set(publicUsers.value.map((user) => user.role)),
    new Set(['user', 'family', 'admin']),
  )
  assert.equal(publicUsers.value.some((user) => 'passwordHash' in user || 'salt' in user), false)
})

test('rejects invalid credentials and persists a valid session', async () => {
  const invalidResult = await auth.login('user@mindbridge.test', 'incorrect')
  assert.equal(invalidResult.ok, false)

  const validResult = await auth.login('user@mindbridge.test', 'User123!')
  assert.equal(validResult.ok, true)
  assert.equal(validResult.user.role, 'user')
  assert.equal(auth.useAuth().isAuthenticated.value, true)

  await auth.initializeAuth()
  assert.equal(auth.useAuth().currentUser.value.email, 'user@mindbridge.test')
})

test('registers a family account and prevents duplicate emails', async () => {
  auth.logout()
  const registration = await auth.register({
    name: 'Test Family',
    email: 'family.new@example.com',
    password: 'Example123!',
    role: 'family',
  })

  assert.equal(registration.ok, true)
  assert.equal(registration.user.role, 'family')

  const duplicate = await auth.register({
    name: 'Duplicate Family',
    email: 'FAMILY.NEW@example.com',
    password: 'Example123!',
    role: 'family',
  })
  assert.equal(duplicate.ok, false)
})

test('allows only an administrator to change another account role', async () => {
  const familyAccount = auth.useAuth().publicUsers.value.find((user) => user.email === 'family.new@example.com')
  assert.equal(auth.updateUserRole(familyAccount.id, 'user'), false)

  auth.logout()
  const adminLogin = await auth.login('admin@mindbridge.test', 'Admin123!')
  assert.equal(adminLogin.ok, true)
  assert.equal(auth.updateUserRole(familyAccount.id, 'user'), true)

  const updatedAccount = auth.useAuth().publicUsers.value.find((user) => user.id === familyAccount.id)
  assert.equal(updatedAccount.role, 'user')
  assert.equal(auth.updateUserRole(adminLogin.user.id, 'family'), false)
})
