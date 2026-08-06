import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import DataExplorerView from '../views/DataExplorerView.vue'
import EventsView from '../views/EventsView.vue'
import FamilySupportView from '../views/FamilySupportView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MoodCheckView from '../views/MoodCheckView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import { authReady, useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
  { path: '/resources', name: 'resources', component: ResourcesView, meta: { title: 'Resources' } },
  { path: '/mood-check', name: 'mood-check', component: MoodCheckView, meta: { title: 'Mood Check' } },
  { path: '/events', name: 'events', component: EventsView, meta: { title: 'Events' } },
  { path: '/family-support', name: 'family-support', component: FamilySupportView, meta: { title: 'Family Support' } },
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'Sign In', guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard', requiresAuth: true } },
  { path: '/data-explorer', name: 'data-explorer', component: DataExplorerView, meta: { title: 'Data Explorer' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  await authReady
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated.value) return { name: 'dashboard' }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | MindBridge`
})

export default router
