<script setup>
import { useOfflineExperience } from '../composables/useOfflineExperience'

const { isOnline } = useOfflineExperience()
</script>

<template>
  <div v-if="!isOnline" class="connectivity-status" role="status" aria-live="polite">
    <span aria-hidden="true">○</span>
    You’re offline. Saved resources and mood check-ins still work on this device.
  </div>
</template>
