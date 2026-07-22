<script setup>
import { computed, reactive, ref } from 'vue'
import PageIntro from '../components/PageIntro.vue'
import { eventFormats, events } from '../data/events'
import { cleanEmail, cleanText } from '../utils/security'
import { readStorage, writeStorage } from '../utils/storage'

const selectedFormat = ref('All')
const selectedEvent = ref(null)
const bookings = ref(readStorage('mindbridge:eventBookings', []))
const errors = ref({})
const successMessage = ref('')

const bookingForm = reactive({
  name: '',
  email: '',
  attendees: 1,
  accessibility: '',
  consent: false,
})

const filteredEvents = computed(() =>
  selectedFormat.value === 'All' ? events : events.filter((event) => event.format === selectedFormat.value),
)

function isBooked(eventId) {
  return bookings.value.some((booking) => booking.eventId === eventId)
}

function openBooking(event) {
  selectedEvent.value = event
  successMessage.value = ''
  errors.value = {}
}

function closeBooking() {
  selectedEvent.value = null
  successMessage.value = ''
  errors.value = {}
}

function validateBooking() {
  const nextErrors = {}
  const cleanName = bookingForm.name.trim()
  const cleanEmail = bookingForm.email.trim()

  if (!cleanName) nextErrors.name = 'Enter the name for this booking.'
  else if (cleanName.length < 2 || cleanName.length > 60) nextErrors.name = 'Name must be between 2 and 60 characters.'
  else if (!/^[\p{L}\p{M} .'-]+$/u.test(cleanName)) nextErrors.name = 'Name can only contain letters, spaces, apostrophes and hyphens.'

  if (!cleanEmail) nextErrors.email = 'Enter an email address for the confirmation.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleanEmail)) nextErrors.email = 'Enter a valid email address, such as name@example.com.'

  if (!Number.isInteger(Number(bookingForm.attendees)) || bookingForm.attendees < 1 || bookingForm.attendees > 4) {
    nextErrors.attendees = 'Choose between 1 and 4 attendees.'
  }
  if (bookingForm.accessibility.length > 200) nextErrors.accessibility = 'Keep accessibility notes to 200 characters or fewer.'
  if (!bookingForm.consent) nextErrors.consent = 'Confirm that the booking details are correct.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function submitBooking() {
  if (!selectedEvent.value || !validateBooking()) return

  const booking = {
    id: crypto.randomUUID(),
    eventId: selectedEvent.value.id,
    name: cleanText(bookingForm.name, 60),
    email: cleanEmail(bookingForm.email),
    attendees: Number(bookingForm.attendees),
    accessibility: cleanText(bookingForm.accessibility, 200),
    createdAt: new Date().toISOString(),
  }

  bookings.value = [booking, ...bookings.value.filter((item) => item.eventId !== booking.eventId)]
  writeStorage('mindbridge:eventBookings', bookings.value)
  successMessage.value = `You’re booked for “${selectedEvent.value.title}”. A confirmation is saved on this device.`
}
</script>

<template>
  <PageIntro
    eyebrow="COMMUNITY EVENTS"
    title="Learn, connect and feel supported."
    description="Join welcoming workshops and community sessions online or near you."
    tone="blue"
  />

  <section class="section container" aria-labelledby="events-heading">
    <div class="filter-row" aria-label="Event format filters">
      <button
        v-for="format in eventFormats"
        :key="format"
        type="button"
        :class="{ selected: selectedFormat === format }"
        :aria-pressed="selectedFormat === format"
        @click="selectedFormat = format"
      >
        {{ format }}
      </button>
    </div>
    <h2 id="events-heading" class="visually-hidden">Available events</h2>
    <div class="event-list">
      <article v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="date-tile"><strong>{{ event.day }}</strong><span>{{ event.month }}</span></div>
        <div>
          <div class="tag-row"><span class="tag">{{ event.type }}</span><span class="tag tag--neutral">{{ event.format }}</span></div>
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <div class="event-meta"><span>◷ {{ event.time }}</span><span>⌖ {{ event.location }}</span><span>♙ Up to {{ event.capacity }}</span></div>
        </div>
        <button class="button" :class="isBooked(event.id) ? 'button--success' : 'button--outline'" type="button" @click="openBooking(event)">
          {{ isBooked(event.id) ? '✓ View booking' : 'Register' }}
        </button>
      </article>
    </div>
  </section>

  <div v-if="selectedEvent" class="modal-backdrop" role="presentation" @click.self="closeBooking">
    <section class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-heading">
      <button class="modal-close" type="button" aria-label="Close event registration" @click="closeBooking">×</button>
      <p class="eyebrow">EVENT REGISTRATION</p>
      <h2 id="booking-heading">{{ selectedEvent.title }}</h2>
      <p>{{ selectedEvent.date }} · {{ selectedEvent.time }} · {{ selectedEvent.location }}</p>

      <div v-if="successMessage" class="booking-success" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Registration saved</h3>
        <p>{{ successMessage }}</p>
        <button class="button button--blue" type="button" @click="closeBooking">Done</button>
      </div>

      <form v-else class="booking-form" novalidate @submit.prevent="submitBooking">
        <label for="booking-name">Full name <span aria-hidden="true">*</span></label>
        <input id="booking-name" v-model="bookingForm.name" type="text" maxlength="60" autocomplete="name" :aria-invalid="Boolean(errors.name)" aria-describedby="booking-name-error" />
        <p v-if="errors.name" id="booking-name-error" class="field-error" role="alert">{{ errors.name }}</p>

        <label for="booking-email">Email address <span aria-hidden="true">*</span></label>
        <input id="booking-email" v-model="bookingForm.email" type="email" maxlength="100" autocomplete="email" :aria-invalid="Boolean(errors.email)" aria-describedby="booking-email-error" />
        <p v-if="errors.email" id="booking-email-error" class="field-error" role="alert">{{ errors.email }}</p>

        <label for="booking-attendees">Number of attendees</label>
        <input id="booking-attendees" v-model.number="bookingForm.attendees" type="number" min="1" max="4" :aria-invalid="Boolean(errors.attendees)" aria-describedby="booking-attendees-error" />
        <p v-if="errors.attendees" id="booking-attendees-error" class="field-error" role="alert">{{ errors.attendees }}</p>

        <label for="booking-accessibility">Accessibility needs <small>(optional)</small></label>
        <textarea id="booking-accessibility" v-model="bookingForm.accessibility" rows="3" maxlength="200" :aria-invalid="Boolean(errors.accessibility)" aria-describedby="booking-accessibility-help booking-accessibility-error"></textarea>
        <div id="booking-accessibility-help" class="character-count">{{ bookingForm.accessibility.length }}/200 characters</div>
        <p v-if="errors.accessibility" id="booking-accessibility-error" class="field-error" role="alert">{{ errors.accessibility }}</p>

        <label class="consent-row">
          <input v-model="bookingForm.consent" type="checkbox" />
          <span>I confirm that these booking details are correct.</span>
        </label>
        <p v-if="errors.consent" class="field-error" role="alert">{{ errors.consent }}</p>

        <button class="button button--blue button--full" type="submit">Confirm registration</button>
      </form>
    </section>
  </div>
</template>
