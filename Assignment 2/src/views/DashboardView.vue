<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { resources } from '../data/resources'
import { events } from '../data/events'
import { useAuth } from '../stores/auth'
import { readStorage } from '../utils/storage'

const { currentUser } = useAuth()

const savedIds = readStorage('mindbridge:savedResources', [])
const bookings = readStorage('mindbridge:eventBookings', [])
const moodHistory = readStorage('mindbridge:moodHistory', [])

const savedResources = computed(() => resources.filter((resource) => savedIds.includes(resource.id)).slice(0, 3))
const bookedEvents = computed(() => events.filter((event) => bookings.some((booking) => booking.eventId === event.id)).slice(0, 2))

const roleLabel = computed(() => ({
  user: 'Individual User',
  family: 'Family Supporter',
  admin: 'Administrator',
}[currentUser.value.role]))

const welcomeMessage = computed(() => ({
  user: 'Your private place for saved resources, check-ins and upcoming support.',
  family: 'Your family-focused tools, conversation guides and workshop bookings.',
  admin: 'Review accounts and access MindBridge content management tools.',
}[currentUser.value.role]))

const recommended = computed(() => {
  if (currentUser.value.role === 'family') return resources.filter((resource) => resource.category === 'Family').slice(0, 2)
  return resources.filter((resource) => ['Anxiety', 'Wellbeing'].includes(resource.category)).slice(0, 2)
})
</script>

<template>
  <section class="dashboard-page">
    <div class="container dashboard-welcome">
      <div>
        <p class="eyebrow">{{ roleLabel }}</p>
        <h1>Good {{ new Date().getHours() < 12 ? 'morning' : 'afternoon' }}, {{ currentUser.name.split(' ')[0] }}.</h1>
        <p>{{ welcomeMessage }}</p>
        <RouterLink v-if="currentUser.role === 'admin'" class="button button--blue" to="/admin">Open admin workspace</RouterLink>
      </div>
      <div class="dashboard-family" aria-hidden="true"><span>☺</span><span>☺</span><span>☺</span></div>
    </div>

    <div class="section container dashboard-grid">
      <article class="dashboard-card dashboard-card--blue">
        <span class="dashboard-icon" aria-hidden="true">♡</span>
        <div>
          <p class="eyebrow">SAVED</p>
          <h2>Saved resources</h2>
          <p v-if="!savedResources.length">Nothing saved yet. Keep useful resources close for later.</p>
          <ul v-else class="dashboard-list"><li v-for="resource in savedResources" :key="resource.id">{{ resource.title }}</li></ul>
          <RouterLink class="text-link" to="/resources">Explore resources →</RouterLink>
        </div>
      </article>

      <article class="dashboard-card dashboard-card--purple">
        <span class="dashboard-icon" aria-hidden="true">▣</span>
        <div>
          <p class="eyebrow">UPCOMING</p>
          <h2>Event bookings</h2>
          <p v-if="!bookedEvents.length">You have no upcoming event bookings on this device.</p>
          <ul v-else class="dashboard-list"><li v-for="event in bookedEvents" :key="event.id">{{ event.title }}</li></ul>
          <RouterLink class="text-link" to="/events">View events →</RouterLink>
        </div>
      </article>

      <article class="dashboard-card dashboard-card--mint">
        <span class="dashboard-icon" aria-hidden="true">☺</span>
        <div>
          <p class="eyebrow">PRIVATE HISTORY</p>
          <h2>Recent check-ins</h2>
          <p>{{ moodHistory.length ? `${moodHistory.length} check-in${moodHistory.length === 1 ? '' : 's'} saved on this device.` : 'No mood check-ins saved yet.' }}</p>
          <RouterLink class="text-link" to="/mood-check">Check in now →</RouterLink>
        </div>
      </article>

      <article class="dashboard-card dashboard-card--yellow">
        <span class="dashboard-icon" aria-hidden="true">★</span>
        <div>
          <p class="eyebrow">FOR YOUR ROLE</p>
          <h2>{{ currentUser.role === 'family' ? 'Family support picks' : 'Recommended for you' }}</h2>
          <ul class="dashboard-list"><li v-for="resource in recommended" :key="resource.id">{{ resource.title }}</li></ul>
          <RouterLink class="text-link" :to="currentUser.role === 'family' ? '/family-support' : '/resources'">See more →</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>

