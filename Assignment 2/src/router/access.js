export function resolveRouteAccess(to, auth) {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !auth.hasRole(to.meta.roles)) {
    return { name: 'unauthorized' }
  }

  if (to.meta.guestOnly && auth.currentUser.value) {
    return { name: auth.currentUser.value.role === 'admin' ? 'admin' : 'dashboard' }
  }
}

