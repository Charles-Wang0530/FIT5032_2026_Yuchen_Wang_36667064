<script setup>
const modules = [
  { title: 'Upcoming workshop', text: 'Supporting a teenager with depression', color: 'blue', icon: '▣' },
  { title: 'Saved guides', text: 'Three resources saved for later', color: 'purple', icon: '♡' },
  { title: 'Recommended for you', text: 'New family support tools', color: 'yellow', icon: '★' },
  { title: 'Recent mood check-ins', text: 'A private place to notice patterns', color: 'mint', icon: '☺' },
]
</script>

<template>
  <section class="dashboard-page">
    <div class="container dashboard-welcome">
      <div><p class="eyebrow">FAMILY SUPPORTER</p><h1>Good morning, Maria.</h1><p>This will become your private, role-aware space in milestone three.</p></div>
      <div class="dashboard-family" aria-hidden="true"><span>☺</span><span>☺</span><span>☺</span></div>
    </div>
    <div class="section container dashboard-grid">
      <article v-for="module in modules" :key="module.title" class="dashboard-card" :class="`dashboard-card--${module.color}`">
        <span class="dashboard-icon" aria-hidden="true">{{ module.icon }}</span>
        <div><p class="eyebrow">PREVIEW</p><h2>{{ module.title }}</h2><p>{{ module.text }}</p></div>
        <button type="button" aria-label="Open preview">→</button>
      </article>
    </div>
  </section>
</template>

