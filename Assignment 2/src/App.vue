<script setup>
import { RouterView } from 'vue-router'
import EmergencyHelp from './components/EmergencyHelp.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <SiteHeader />
    <main id="main-content">
      <RouterView />
    </main>
    <SiteFooter />
    <EmergencyHelp />
  </div>
</template>

