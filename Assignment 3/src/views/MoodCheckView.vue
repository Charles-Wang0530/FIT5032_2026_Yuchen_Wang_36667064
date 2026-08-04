<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { useOfflineExperience } from '../composables/useOfflineExperience'
import { resources } from '../data/resources'

const moods = [
  { icon: '◡', label: 'Calm' },
  { icon: '—', label: 'Managing' },
  { icon: '⌁', label: 'Anxious' },
  { icon: '∿', label: 'Overwhelmed' },
  { icon: '○', label: 'Lonely' },
]

const selectedMood = ref('')
const pressure = ref('')
const submitted = ref(false)
const { saveMoodCheck } = useOfflineExperience()

const recommendations = computed(() => resources.filter((resource) => resource.moods.includes(selectedMood.value)).slice(0, 3))

function submitCheckIn() {
  if (!selectedMood.value || !pressure.value) return
  saveMoodCheck({ mood: selectedMood.value, pressure: pressure.value })
  submitted.value = true
}
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
        <button
          v-for="mood in moods"
          :key="mood.label"
          type="button"
          class="mood-option"
          :class="{ selected: selectedMood === mood.label }"
          :aria-pressed="selectedMood === mood.label"
          @click="selectedMood = mood.label; submitted = false"
        >
          <span aria-hidden="true">{{ mood.icon }}</span>{{ mood.label }}
        </button>
      </div>
      <div class="form-preview">
        <label for="pressure">What is taking up the most space today?</label>
        <select id="pressure" v-model="pressure" @change="submitted = false">
          <option value="">Choose an area</option>
          <option>Work or study</option>
          <option>Family</option>
          <option>Sleep</option>
          <option>Social connection</option>
        </select>
        <button class="button button--blue" type="button" :disabled="!selectedMood || !pressure" @click="submitCheckIn">Show supportive resources</button>
      </div>
      <div v-if="submitted" class="recommendation-panel" aria-live="polite">
        <p class="eyebrow">A GENTLE NEXT STEP</p>
        <h2>Resources for feeling {{ selectedMood.toLowerCase() }}</h2>
        <ul>
          <li v-for="resource in recommendations" :key="resource.id">
            <strong>{{ resource.title }}</strong><span>{{ resource.duration }} min</span>
          </li>
        </ul>
        <RouterLink class="button button--outline" to="/resources">Browse all resources</RouterLink>
        <p>Your check-in is stored only on this device.</p>
      </div>
    </div>
  </section>
</template>
