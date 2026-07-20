<script setup>
import { RouterLink } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="FOR PARENTS, CARERS AND FRIENDS"
    title="Supporting someone starts with feeling supported too."
    description="Find practical conversation guides, warning-sign information and family-focused events."
  >
    <RouterLink class="button button--blue" to="/resources">Explore family resources</RouterLink>
  </PageIntro>
  <section class="section container">
    <div class="support-paths">
      <article><span>01</span><h2>Notice the signs</h2><p>Understand changes in mood, behaviour and everyday routines without jumping to conclusions.</p></article>
      <article><span>02</span><h2>Start a conversation</h2><p>Use simple, non-judgemental prompts that make it easier to listen and stay connected.</p></article>
      <article><span>03</span><h2>Find the next step</h2><p>Explore workshops, professional pathways and urgent help when it may be needed.</p></article>
    </div>
  </section>
</template>

