<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useOfflineExperience } from '../composables/useOfflineExperience'

const router = useRouter()
const { currentUser, signOut } = useAuth()
const { moodHistory, savedResourceIds } = useOfflineExperience()

const displayName = computed(() => currentUser.value?.displayName || currentUser.value?.email?.split('@')[0] || 'there')
const modules = computed(() => [
  { title: 'Upcoming workshop', text: 'Supporting a teenager with depression', color: 'blue', icon: '▣' },
  { title: 'Saved guides', text: `${savedResourceIds.value.length} resources saved on this device`, color: 'purple', icon: '♡' },
  { title: 'Account security', text: currentUser.value?.email || 'Firebase authenticated account', color: 'yellow', icon: '★' },
  { title: 'Recent mood check-ins', text: `${moodHistory.value.length} private check-ins stored locally`, color: 'mint', icon: '☺' },
])

async function handleSignOut() {
  await signOut()
  await router.push('/')
}
</script>

<template>
  <section class="dashboard-page">
    <div class="container dashboard-welcome">
      <div>
        <p class="eyebrow">YOUR MINDBRIDGE SPACE</p>
        <h1>Hello, {{ displayName }}.</h1>
        <p>Your account is protected by Firebase Authentication. Mood check-ins remain private on this device.</p>
        <button class="button button--outline" type="button" @click="handleSignOut">Sign out</button>
      </div>
      <div class="dashboard-family" aria-hidden="true"><span>☺</span><span>☺</span><span>☺</span></div>
    </div>
    <div class="section container dashboard-grid">
      <article v-for="module in modules" :key="module.title" class="dashboard-card" :class="`dashboard-card--${module.color}`">
        <span class="dashboard-icon" aria-hidden="true">{{ module.icon }}</span>
        <div><p class="eyebrow">ACCOUNT OVERVIEW</p><h2>{{ module.title }}</h2><p>{{ module.text }}</p></div>
      </article>
    </div>
  </section>
</template>
