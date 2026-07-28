<script setup>
import { onMounted, ref } from 'vue'

const city = ref('')
const weather = ref(null)
const locationLabel = ref('')
const loading = ref(false)
const error = ref('')

const weatherDescriptions = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Foggy', '🌫️'],
  48: ['Foggy', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Drizzle', '🌦️'],
  55: ['Heavy drizzle', '🌧️'],
  61: ['Light rain', '🌧️'],
  63: ['Rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  71: ['Light snow', '🌨️'],
  73: ['Snow', '🌨️'],
  75: ['Heavy snow', '🌨️'],
  80: ['Rain showers', '🌦️'],
  81: ['Rain showers', '🌧️'],
  82: ['Heavy rain showers', '🌧️'],
  95: ['Thunderstorm', '⛈️']
}

const loadWeather = async (latitude, longitude, label) => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
    )

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    const [description, icon] = weatherDescriptions[data.current.weather_code] ?? ['Unknown weather', '🌡️']
    weather.value = { temperature: data.current.temperature_2m, description, icon }
    locationLabel.value = label
  } catch (err) {
    error.value = `Unable to load weather data: ${err.message}`
  } finally {
    loading.value = false
  }
}

const searchByCity = async () => {
  const searchTerm = city.value.trim()
  if (!searchTerm) {
    error.value = 'Please enter a city name.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const [placeName, requestedCountry] = searchTerm.split(',').map((part) => part.trim())
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=10&language=en&format=json`
    )
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    const place = data.results?.find(
      (result) => !requestedCountry || result.country_code?.toLowerCase() === requestedCountry.toLowerCase()
    ) ?? data.results?.[0]
    if (!place) throw new Error('City not found.')

    const country = place.country_code ?? place.country ?? ''
    await loadWeather(place.latitude, place.longitude, `${place.name}, ${country}`)
  } catch (err) {
    error.value = `Unable to find city weather: ${err.message}`
    loading.value = false
  }
}

const loadCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => loadWeather(coords.latitude, coords.longitude, 'Current location'),
    () => {
      error.value = 'Location permission was not granted. Search for a city instead.'
    }
  )
}

onMounted(loadCurrentLocationWeather)
</script>

<template>
  <div class="container mt-5">
    <div class="text-center">
      <h1>WEATHER APP</h1>
      <form class="input-group mx-auto weather-search" @submit.prevent="searchByCity">
        <input v-model="city" type="text" class="form-control" placeholder="Enter city name" />
        <button class="btn btn-secondary" type="submit" :disabled="loading">Search</button>
      </form>

      <p v-if="loading" class="mt-4">Loading weather…</p>
      <p v-else-if="error" class="text-danger mt-4">{{ error }}</p>
      <section v-else-if="weather" class="mt-4" aria-live="polite">
        <h2>{{ locationLabel }}</h2>
        <p class="weather-icon" aria-hidden="true">{{ weather.icon }}</p>
        <p class="fs-3">{{ weather.temperature }} °C</p>
        <p class="fs-4">{{ weather.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.weather-search { max-width: 32rem; }
.weather-icon { font-size: 4rem; margin: 1rem 0 0; }
</style>
