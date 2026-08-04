<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tone: { type: String, default: 'yellow' },
})
</script>

<template>
  <section class="page-intro" :class="`page-intro--${tone}`">
    <div class="container page-intro__content">
      <div>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="page-intro__description">{{ description }}</p>
        <slot />
      </div>
      <div class="page-intro__art" aria-hidden="true">
        <span class="art-sun"></span>
        <span class="art-cloud"></span>
        <span class="art-wave art-wave--one"></span>
        <span class="art-wave art-wave--two"></span>
      </div>
    </div>
  </section>
</template>

