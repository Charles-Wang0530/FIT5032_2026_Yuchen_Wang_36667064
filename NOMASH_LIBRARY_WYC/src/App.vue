<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <BHeader />
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
