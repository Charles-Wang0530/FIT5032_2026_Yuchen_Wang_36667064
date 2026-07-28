import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import AddBookView from '@/views/AddBookView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'
import GetAllBookAPIView from '@/views/GetAllBookAPIView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import HomeView from '../views/HomeView.vue'
import JSONLabView from '../views/JSONLabView.vue'
import LoginView from '../views/LoginView.vue'
import WeatherView from '../views/WeatherView.vue'
import { firebaseRole, firebaseUser } from '../firebaseSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/addbook', name: 'AddBook', component: AddBookView, meta: { requiresFirebaseAuth: true } },
    { path: '/CountBookAPI', name: 'CountBookAPI', component: CountBookAPI },
    {
      path: '/GetAllBookAPI',
      name: 'GetAllBookAPI',
      component: GetAllBookAPIView,
      meta: { requiresFirebaseAuth: true }
    },
    { path: '/about', name: 'about', component: AboutView, meta: { requiresFirebaseAuth: true } },
    {
      path: '/json-lab',
      name: 'json-lab',
      component: JSONLabView,
      meta: { requiresFirebaseAuth: true, requiredRole: 'admin' }
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView },
    { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView },
    { path: '/WeatherCheck', name: 'WeatherCheck', component: WeatherView },
    { path: '/access-denied', name: 'access-denied', component: AccessDeniedView }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresFirebaseAuth && !firebaseUser.value) {
    return { name: 'FireLogin', query: { redirect: to.fullPath, denied: 'true' } }
  }

  if (to.meta.requiredRole && to.meta.requiredRole !== firebaseRole.value) {
    return { name: 'access-denied' }
  }
})

export default router
