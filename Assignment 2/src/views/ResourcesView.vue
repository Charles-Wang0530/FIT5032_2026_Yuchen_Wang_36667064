<script setup>
import PageIntro from '../components/PageIntro.vue'

const previewResources = [
  { icon: '☁', tag: 'Anxiety', title: '5-Minute Grounding Exercise', color: 'blue' },
  { icon: '☾', tag: 'Sleep', title: 'Better Sleep, Better You', color: 'purple' },
  { icon: '♥', tag: 'Family', title: 'Talking About Big Feelings', color: 'coral' },
  { icon: '◒', tag: 'Work & Study', title: 'Focus When It Matters', color: 'mint' },
  { icon: '☀', tag: 'Loneliness', title: 'You’re Not Alone', color: 'yellow' },
  { icon: '♧', tag: 'Wellbeing', title: 'Daily Self-Care Checklist', color: 'sky' },
]

const filters = ['All', 'Anxiety', 'Sleep', 'Family', 'Work & Study', 'Loneliness']
</script>

<template>
  <PageIntro
    eyebrow="MENTAL HEALTH RESOURCES"
    title="Find support for how you feel today."
    description="Browse clear, practical resources designed for real moments in everyday life."
  >
    <label class="search-preview">
      <span aria-hidden="true">⌕</span>
      <input type="search" placeholder="Search anxiety, sleep, family support…" aria-label="Search resources" />
    </label>
  </PageIntro>

  <section class="section container">
    <div class="filter-row" aria-label="Resource filters">
      <button v-for="(filter, index) in filters" :key="filter" type="button" :class="{ selected: index === 0 }">
        {{ filter }}
      </button>
    </div>

    <div class="resource-grid">
      <article v-for="resource in previewResources" :key="resource.title" class="resource-card">
        <div class="resource-illustration" :class="`resource-illustration--${resource.color}`" aria-hidden="true">
          {{ resource.icon }}
        </div>
        <div class="resource-card__body">
          <span class="tag">{{ resource.tag }}</span>
          <h2>{{ resource.title }}</h2>
          <p>Short, approachable guidance to support your wellbeing, one useful step at a time.</p>
          <div class="rating-preview" aria-label="Preview rating 4.8 out of 5">★★★★★ <strong>4.8</strong></div>
        </div>
        <button class="bookmark" type="button" :aria-label="`Save ${resource.title}`">♡</button>
      </article>
    </div>
    <p class="coming-note">Search, filtering and live aggregated ratings will be connected in the next milestone.</p>
  </section>
</template>

