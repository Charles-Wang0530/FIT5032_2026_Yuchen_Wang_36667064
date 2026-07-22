<script setup>
import { computed, ref } from 'vue'
import PageIntro from '../components/PageIntro.vue'
import { resources } from '../data/resources'
import { cleanText } from '../utils/security'
import { readStorage, writeStorage } from '../utils/storage'

const moods = [
  { icon: '◡', label: 'Calm' },
  { icon: '—', label: 'Managing' },
  { icon: '⌁', label: 'Anxious' },
  { icon: '∿', label: 'Overwhelmed' },
  { icon: '○', label: 'Lonely' },
]

const pressureOptions = [
  { value: 'work', label: 'Work or study', keywords: ['work', 'study', 'career', 'focus'] },
  { value: 'family', label: 'Family or relationships', keywords: ['family', 'conversation', 'support'] },
  { value: 'sleep', label: 'Sleep or energy', keywords: ['sleep', 'rest', 'routine'] },
  { value: 'connection', label: 'Social connection', keywords: ['loneliness', 'connection', 'community'] },
  { value: 'unsure', label: 'I am not sure yet', keywords: ['wellbeing', 'self-care', 'grounding'] },
]

const selectedMood = ref('')
const selectedPressure = ref('')
const note = ref('')
const errors = ref({})
const result = ref(null)
const saveMessage = ref('')
const moodHistory = ref(readStorage('mindbridge:moodHistory', []))

const recommendedResources = computed(() => {
  if (!result.value) return []

  const moodKeywords = {
    Calm: ['wellbeing', 'self-care'],
    Managing: ['stress', 'routine', 'focus'],
    Anxious: ['anxiety', 'grounding', 'stress'],
    Overwhelmed: ['overwhelmed', 'grounding', 'self-care'],
    Lonely: ['loneliness', 'connection', 'community'],
  }[result.value.mood]
  const pressureKeywords = pressureOptions.find((option) => option.value === result.value.pressure)?.keywords ?? []
  const wantedKeywords = new Set([...moodKeywords, ...pressureKeywords])

  return resources
    .map((resource) => ({
      ...resource,
      score: resource.keywords.filter((keyword) => wantedKeywords.has(keyword)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
})

function validateCheckIn() {
  const nextErrors = {}
  if (!selectedMood.value) nextErrors.mood = 'Choose the feeling that comes closest right now.'
  if (!selectedPressure.value) nextErrors.pressure = 'Choose one area, or select “I am not sure yet”.'
  if (note.value.trim().length > 160) nextErrors.note = 'Keep your note to 160 characters or fewer.'
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function submitCheckIn() {
  saveMessage.value = ''
  if (!validateCheckIn()) return

  result.value = {
    id: crypto.randomUUID(),
    mood: selectedMood.value,
    pressure: selectedPressure.value,
    note: cleanText(note.value, 160),
    createdAt: new Date().toISOString(),
  }

  moodHistory.value = [result.value, ...moodHistory.value].slice(0, 12)
  const saved = writeStorage('mindbridge:moodHistory', moodHistory.value)
  saveMessage.value = saved ? 'Your private check-in was saved on this device.' : 'Recommendations are ready.'
}

function startAgain() {
  selectedMood.value = ''
  selectedPressure.value = ''
  note.value = ''
  errors.value = {}
  result.value = null
  saveMessage.value = ''
}

function formatCheckInDate(dateString) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
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
    <form v-if="!result" class="check-card" novalidate @submit.prevent="submitCheckIn">
      <fieldset :aria-describedby="errors.mood ? 'mood-error' : undefined">
        <legend class="step-label"><span>1</span> Choose the feeling that comes closest</legend>
        <div class="mood-grid">
          <label v-for="mood in moods" :key="mood.label" class="mood-option" :class="{ selected: selectedMood === mood.label }">
            <input v-model="selectedMood" type="radio" name="mood" :value="mood.label" />
            <span aria-hidden="true">{{ mood.icon }}</span>{{ mood.label }}
          </label>
        </div>
        <p v-if="errors.mood" id="mood-error" class="field-error" role="alert">{{ errors.mood }}</p>
      </fieldset>

      <div class="form-preview">
        <label for="pressure"><span class="step-number">2</span> What is taking up the most space today?</label>
        <select id="pressure" v-model="selectedPressure" :aria-invalid="Boolean(errors.pressure)" aria-describedby="pressure-error">
          <option value="">Choose an area</option>
          <option v-for="option in pressureOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <p v-if="errors.pressure" id="pressure-error" class="field-error" role="alert">{{ errors.pressure }}</p>

        <label for="check-note"><span class="step-number">3</span> Add a private note <small>(optional)</small></label>
        <textarea
          id="check-note"
          v-model="note"
          rows="4"
          maxlength="160"
          placeholder="A few words about what is happening…"
          :aria-invalid="Boolean(errors.note)"
          aria-describedby="note-help note-error"
        ></textarea>
        <div id="note-help" class="character-count">{{ note.length }}/160 characters</div>
        <p v-if="errors.note" id="note-error" class="field-error" role="alert">{{ errors.note }}</p>

        <button class="button button--blue" type="submit">Show supportive resources</button>
      </div>
    </form>

    <section v-else class="recommendation-panel" aria-labelledby="recommendation-title">
      <div class="recommendation-heading">
        <div class="result-face" aria-hidden="true">{{ moods.find((mood) => mood.label === result.mood)?.icon }}</div>
        <div>
          <p class="eyebrow">YOUR PRIVATE RESULTS</p>
          <h2 id="recommendation-title">A few gentle places to start.</h2>
          <p>You said you are feeling <strong>{{ result.mood.toLowerCase() }}</strong>. These suggestions are based on your selections.</p>
          <p class="success-message" role="status">✓ {{ saveMessage }}</p>
        </div>
      </div>
      <div class="recommendation-grid">
        <article v-for="resource in recommendedResources" :key="resource.id">
          <span class="tag">{{ resource.category }}</span>
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.summary }}</p>
          <RouterLink :to="{ path: '/resources', query: { search: resource.category } }">Explore this topic →</RouterLink>
        </article>
      </div>
      <button class="button button--outline" type="button" @click="startAgain">Start another check-in</button>
    </section>

    <section v-if="moodHistory.length" class="mood-history" aria-labelledby="mood-history-title">
      <div>
        <p class="eyebrow">SAVED ON THIS DEVICE</p>
        <h2 id="mood-history-title">Recent check-ins</h2>
      </div>
      <ul>
        <li v-for="checkIn in moodHistory.slice(0, 3)" :key="checkIn.id">
          <span class="history-face" aria-hidden="true">{{ moods.find((mood) => mood.label === checkIn.mood)?.icon }}</span>
          <div><strong>{{ checkIn.mood }}</strong><small>{{ formatCheckInDate(checkIn.createdAt) }}</small></div>
        </li>
      </ul>
    </section>
  </section>
</template>
