<script setup>
import { RouterLink } from 'vue-router'
import BrandMark from './BrandMark.vue'
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="footer-brand"><BrandMark /> MindBridge</div>
        <p>A friendly first step towards feeling supported, informed and connected.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <RouterLink to="/resources">Resources</RouterLink>
        <RouterLink to="/mood-check">Mood check</RouterLink>
        <RouterLink to="/events">Community events</RouterLink>
      </div>
      <div>
        <h2>Support</h2>
        <RouterLink to="/family-support">Family support</RouterLink>
        <RouterLink to="/login">Your account</RouterLink>
        <a href="https://www.lifeline.org.au/" target="_blank" rel="noopener noreferrer">Urgent help</a>
      </div>
    </div>
    <div class="container footer-note">
      <span>© 2026 MindBridge</span>
      <span>This learning project does not replace professional medical advice.</span>
    </div>
  </footer>
</template>

