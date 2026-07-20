<script setup>
import PageIntro from '../components/PageIntro.vue'

const moods = [
  { icon: '◡', label: 'Calm' },
  { icon: '—', label: 'Managing' },
  { icon: '⌁', label: 'Anxious' },
  { icon: '∿', label: 'Overwhelmed' },
  { icon: '○', label: 'Lonely' },
]
</script>

<template>
  <PageIntro
    eyebrow="PRIVATE MOOD CHECK"
    title="How are you feeling right now?"
    description="Take a quiet moment for yourself. No account is needed, and you choose what to share."
    tone="blue"
  />
  <section class="section container narrow-section">
    <div class="check-card">
      <div class="step-label"><span>1</span> Choose the feeling that comes closest</div>
      <div class="mood-grid">
        <button v-for="mood in moods" :key="mood.label" type="button" class="mood-option">
          <span aria-hidden="true">{{ mood.icon }}</span>{{ mood.label }}
        </button>
      </div>
      <div class="form-preview">
        <label for="pressure">What is taking up the most space today?</label>
        <select id="pressure">
          <option value="">Choose an area</option>
          <option>Work or study</option>
          <option>Family</option>
          <option>Sleep</option>
          <option>Social connection</option>
        </select>
        <button class="button button--blue" type="button">Show supportive resources</button>
      </div>
      <p class="coming-note">Personalised recommendations and validation will be activated in the next milestone.</p>
    </div>
  </section>
</template>

