import { computed, onMounted, onUnmounted, ref } from 'vue'

const STORAGE_KEY = 'mindbridge-offline-data-v1'
const isOnline = ref(typeof navigator === 'undefined' ? true : navigator.onLine)
const savedResourceIds = ref([])
const moodHistory = ref([])
let initialised = false

function readStoredData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    savedResourceIds.value = Array.isArray(stored.savedResourceIds) ? stored.savedResourceIds : []
    moodHistory.value = Array.isArray(stored.moodHistory) ? stored.moodHistory : []
  } catch {
    savedResourceIds.value = []
    moodHistory.value = []
  }
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ savedResourceIds: savedResourceIds.value, moodHistory: moodHistory.value }),
  )
}

function updateConnection() {
  isOnline.value = navigator.onLine
}

export function useOfflineExperience() {
  onMounted(() => {
    if (!initialised) {
      readStoredData()
      window.addEventListener('online', updateConnection)
      window.addEventListener('offline', updateConnection)
      initialised = true
    }
  })

  onUnmounted(() => {})

  function toggleSavedResource(id) {
    savedResourceIds.value = savedResourceIds.value.includes(id)
      ? savedResourceIds.value.filter((resourceId) => resourceId !== id)
      : [...savedResourceIds.value, id]
    persist()
  }

  function saveMoodCheck(entry) {
    moodHistory.value = [{ ...entry, createdAt: new Date().toISOString() }, ...moodHistory.value].slice(0, 10)
    persist()
  }

  return {
    isOnline: computed(() => isOnline.value),
    savedResourceIds: computed(() => savedResourceIds.value),
    moodHistory: computed(() => moodHistory.value),
    toggleSavedResource,
    saveMoodCheck,
  }
}
