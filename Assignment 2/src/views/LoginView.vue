<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="account-page">
    <div class="account-art">
      <div>
        <p class="eyebrow">YOUR PRIVATE SPACE</p>
        <h1>Keep useful support close.</h1>
        <p>Save resources, manage event bookings and see recommendations made for your role.</p>
        <div class="account-face" aria-hidden="true">☺</div>
      </div>
    </div>
    <div class="account-panel">
      <div class="account-form">
        <p class="eyebrow">WELCOME BACK</p>
        <h2>Sign in to MindBridge</h2>
        <p>Authentication will be connected in milestone three.</p>
        <label>Email address<input type="email" placeholder="you@example.com" /></label>
        <label>Password<input type="password" placeholder="Enter your password" /></label>
        <button class="button button--blue button--full" type="button">Sign in</button>
        <p class="account-switch">New to MindBridge? <RouterLink to="/login">Create an account</RouterLink></p>
      </div>
    </div>
  </section>
</template>

