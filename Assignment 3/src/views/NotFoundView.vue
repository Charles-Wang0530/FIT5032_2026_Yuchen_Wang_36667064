<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found container">
    <span aria-hidden="true">?</span>
    <p class="eyebrow">404</p>
    <h1>That page is not here.</h1>
    <p>Let’s get you back to a useful starting point.</p>
    <RouterLink class="button button--blue" to="/">Return home</RouterLink>
  </section>
</template>

