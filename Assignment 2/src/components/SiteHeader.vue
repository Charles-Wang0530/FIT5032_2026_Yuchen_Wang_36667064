<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandMark from './BrandMark.vue'
import { useAuth } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
const menuOpen = ref(false)

const links = [
  { label: 'Resources', to: '/resources' },
  { label: 'Mood Check', to: '/mood-check' },
  { label: 'Events', to: '/events' },
  { label: 'Family Support', to: '/family-support' },
]

function closeMenu() {
  menuOpen.value = false
}

function signOut() {
  logout()
  closeMenu()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <nav class="nav-bar container" aria-label="Primary navigation">
      <RouterLink class="brand" to="/" aria-label="MindBridge home" @click="closeMenu">
        <BrandMark />
        <span>MindBridge</span>
      </RouterLink>

      <button
        class="menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-links"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <div id="primary-links" class="nav-links" :class="{ open: menuOpen }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ active: route.path === link.to }"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
        <template v-if="isAuthenticated">
          <RouterLink v-if="isAdmin" to="/admin" :class="{ active: route.path === '/admin' }" @click="closeMenu">Admin</RouterLink>
          <RouterLink class="account-link" to="/dashboard" @click="closeMenu">
            <span class="account-avatar" aria-hidden="true">{{ currentUser.name.charAt(0) }}</span>
            {{ currentUser.name.split(' ')[0] }}
          </RouterLink>
          <button class="sign-out" type="button" @click="signOut">Sign Out</button>
        </template>
        <RouterLink v-else class="sign-in" to="/login" @click="closeMenu">Sign In</RouterLink>
      </div>
    </nav>
  </header>
</template>
