import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveRouteAccess } from '../src/router/access.js'

function mockAuth(role = null) {
  return {
    isAuthenticated: { value: Boolean(role) },
    currentUser: { value: role ? { role } : null },
    hasRole: (roles) => Boolean(role && roles.includes(role)),
  }
}

test('redirects a signed-out visitor from a protected page', () => {
  const result = resolveRouteAccess(
    { fullPath: '/dashboard', meta: { requiresAuth: true, roles: ['user', 'family', 'admin'] } },
    mockAuth(),
  )
  assert.deepEqual(result, { name: 'login', query: { redirect: '/dashboard' } })
})

test('blocks a member account from the administrator page', () => {
  const result = resolveRouteAccess(
    { fullPath: '/admin', meta: { requiresAuth: true, roles: ['admin'] } },
    mockAuth('user'),
  )
  assert.deepEqual(result, { name: 'unauthorized' })
})

test('allows an administrator to open the administrator page', () => {
  const result = resolveRouteAccess(
    { fullPath: '/admin', meta: { requiresAuth: true, roles: ['admin'] } },
    mockAuth('admin'),
  )
  assert.equal(result, undefined)
})

test('redirects an authenticated user away from the guest sign-in page', () => {
  const memberResult = resolveRouteAccess({ fullPath: '/login', meta: { guestOnly: true } }, mockAuth('family'))
  const adminResult = resolveRouteAccess({ fullPath: '/login', meta: { guestOnly: true } }, mockAuth('admin'))
  assert.deepEqual(memberResult, { name: 'dashboard' })
  assert.deepEqual(adminResult, { name: 'admin' })
})
