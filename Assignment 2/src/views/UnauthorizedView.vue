<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '../stores/auth'

const { currentUser } = useAuth()
</script>

<template>
  <section class="not-found container">
    <span aria-hidden="true">!</span>
    <p class="eyebrow">ROLE-PROTECTED PAGE</p>
    <h1>You do not have access to this area.</h1>
    <p>Your {{ currentUser?.role || 'current' }} account does not include permission for this page.</p>
    <RouterLink class="button button--blue" to="/dashboard">Return to your dashboard</RouterLink>
  </section>
</template>
