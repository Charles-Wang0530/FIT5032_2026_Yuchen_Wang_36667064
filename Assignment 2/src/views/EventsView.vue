<script setup>
import PageIntro from '../components/PageIntro.vue'

const events = [
  { day: '24', month: 'JUL', title: 'Understanding workplace anxiety', type: 'Online workshop' },
  { day: '29', month: 'JUL', title: 'Supporting a teenager with depression', type: 'Family session' },
  { day: '03', month: 'AUG', title: 'Connection after moving somewhere new', type: 'Community meetup' },
]
</script>

<template>
  <PageIntro
    eyebrow="COMMUNITY EVENTS"
    title="Learn, connect and feel supported."
    description="Join welcoming workshops and community sessions online or near you."
    tone="blue"
  />
  <section class="section container">
    <div class="event-list">
      <article v-for="event in events" :key="event.title" class="event-card">
        <div class="date-tile"><strong>{{ event.day }}</strong><span>{{ event.month }}</span></div>
        <div>
          <span class="tag">{{ event.type }}</span>
          <h2>{{ event.title }}</h2>
          <p>6:30 pm · Free · Friendly and confidential</p>
        </div>
        <button class="button button--outline" type="button">View event</button>
      </article>
    </div>
    <p class="coming-note">Event registration and validated booking forms will be connected in the next milestone.</p>
  </section>
</template>

