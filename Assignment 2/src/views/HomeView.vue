<script setup>
import { RouterLink } from 'vue-router'

const features = [
  {
    icon: '☺',
    title: 'Anonymous Mood Check',
    body: 'Take a quick, private check-in to better understand how you are feeling right now.',
    link: '/mood-check',
    action: 'Check your mood',
    className: 'feature-card--blue',
  },
  {
    icon: '▤',
    title: 'Trusted Resources',
    body: 'Explore practical articles, tools and guides organised around what matters to you.',
    link: '/resources',
    action: 'Browse resources',
    className: 'feature-card--yellow',
  },
  {
    icon: '●●●',
    title: 'Community Support',
    body: 'Find welcoming events, family workshops and ways to feel more connected.',
    link: '/events',
    action: 'Find support',
    className: 'feature-card--purple',
  },
]
</script>

<template>
  <section class="home-hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">PRIVATE. PRACTICAL. HUMAN.</p>
        <h1>A calmer first step starts here.</h1>
        <p>
          MindBridge helps you feel heard, supported and less alone—with simple tools for whatever today brings.
        </p>
        <div class="button-row">
          <RouterLink class="button button--blue" to="/mood-check">♥ Check in with yourself</RouterLink>
          <RouterLink class="button button--outline" to="/resources">Explore resources →</RouterLink>
        </div>
      </div>

      <div class="bridge-scene" aria-label="An illustration of people moving across a bridge together" role="img">
        <span class="sun"></span>
        <span class="cloud cloud--one"></span>
        <span class="cloud cloud--two"></span>
        <div class="people">
          <span class="person person--one"><i></i></span>
          <span class="person person--two"><i></i></span>
          <span class="person person--three"><i></i></span>
          <span class="person person--four"><i></i></span>
        </div>
        <div class="bridge"></div>
        <span class="hill hill--one"></span>
        <span class="hill hill--two"></span>
      </div>
    </div>
  </section>

  <section class="section container" aria-labelledby="support-heading">
    <div class="section-heading">
      <div>
        <p class="eyebrow">START WHERE YOU ARE</p>
        <h2 id="support-heading">Support made simpler.</h2>
      </div>
      <p>Choose the path that feels most useful today. You can explore anonymously or create an account later.</p>
    </div>

    <div class="feature-grid">
      <article v-for="feature in features" :key="feature.title" class="feature-card" :class="feature.className">
        <span class="feature-icon" aria-hidden="true">{{ feature.icon }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.body }}</p>
        <RouterLink :to="feature.link">{{ feature.action }} <span aria-hidden="true">→</span></RouterLink>
      </article>
    </div>
  </section>

  <section class="section container">
    <div class="together-banner">
      <div>
        <p class="eyebrow">SMALL STEPS ADD UP</p>
        <h2>You do not have to figure it out alone.</h2>
        <p>Practical tools, community connection and support for individuals and families.</p>
        <RouterLink class="button button--light" to="/family-support">Explore family support</RouterLink>
      </div>
      <div class="together-faces" aria-hidden="true"><span>☺</span><span>☺</span><span>☺</span></div>
    </div>
  </section>
</template>

