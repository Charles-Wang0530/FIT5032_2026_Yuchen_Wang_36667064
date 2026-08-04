<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BrandMark from './BrandMark.vue'

const route = useRoute()
const menuOpen = ref(false)

const links = [
  { label: 'Resources', to: '/resources' },
  { label: 'Mood Check', to: '/mood-check' },
  { label: 'Events', to: '/events' },
  { label: 'Data Explorer', to: '/data-explorer' },
  { label: 'Family Support', to: '/family-support' },
]

function closeMenu() {
  menuOpen.value = false
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
        <RouterLink class="sign-in" to="/login" @click="closeMenu">Sign In</RouterLink>
      </div>
    </nav>
  </header>
</template>
