<script setup>
import { computed, ref } from 'vue'
import PageIntro from '../components/PageIntro.vue'
import { useOfflineExperience } from '../composables/useOfflineExperience'
import { resourceCategories, resources } from '../data/resources'

const query = ref('')
const selectedCategory = ref('All')
const showSavedOnly = ref(false)
const { savedResourceIds, toggleSavedResource } = useOfflineExperience()

const filteredResources = computed(() => {
  const normalisedQuery = query.value.trim().toLowerCase()
  return resources.filter((resource) => {
    const matchesCategory = selectedCategory.value === 'All' || resource.category === selectedCategory.value
    const matchesSaved = !showSavedOnly.value || savedResourceIds.value.includes(resource.id)
    const searchableText = `${resource.title} ${resource.category} ${resource.summary}`.toLowerCase()
    return matchesCategory && matchesSaved && searchableText.includes(normalisedQuery)
  })
})
</script>

<template>
  <PageIntro
    eyebrow="MENTAL HEALTH RESOURCES"
    title="Find support for how you feel today."
    description="Browse clear, practical resources designed for real moments in everyday life."
  >
    <label class="search-preview">
      <span aria-hidden="true">⌕</span>
      <input v-model="query" type="search" placeholder="Search anxiety, sleep, family support…" aria-label="Search resources" />
    </label>
  </PageIntro>

  <section class="section container">
    <div class="filter-row" aria-label="Resource filters">
      <button
        v-for="filter in resourceCategories"
        :key="filter"
        type="button"
        :class="{ selected: selectedCategory === filter }"
        :aria-pressed="selectedCategory === filter"
        @click="selectedCategory = filter"
      >
        {{ filter }}
      </button>
      <button type="button" :class="{ selected: showSavedOnly }" :aria-pressed="showSavedOnly" @click="showSavedOnly = !showSavedOnly">
        Saved ({{ savedResourceIds.length }})
      </button>
    </div>

    <div class="resource-grid">
      <article v-for="resource in filteredResources" :key="resource.id" class="resource-card">
        <div class="resource-illustration" :class="`resource-illustration--${resource.color}`" aria-hidden="true">
          {{ resource.icon }}
        </div>
        <div class="resource-card__body">
          <span class="tag">{{ resource.category }}</span>
          <h2>{{ resource.title }}</h2>
          <p>{{ resource.summary }}</p>
          <p class="resource-meta">{{ resource.duration }} min read</p>
          <div class="rating-preview" :aria-label="`Rating ${resource.rating} out of 5`">★★★★★ <strong>{{ resource.rating }}</strong></div>
        </div>
        <button
          class="bookmark"
          :class="{ saved: savedResourceIds.includes(resource.id) }"
          type="button"
          :aria-pressed="savedResourceIds.includes(resource.id)"
          :aria-label="`${savedResourceIds.includes(resource.id) ? 'Remove' : 'Save'} ${resource.title}`"
          @click="toggleSavedResource(resource.id)"
        >{{ savedResourceIds.includes(resource.id) ? '♥' : '♡' }}</button>
      </article>
    </div>
    <p v-if="filteredResources.length === 0" class="empty-state" role="status">No resources match these filters. Try another search or category.</p>
    <p class="coming-note">Saved resources remain available on this device, including while you are offline.</p>
  </section>
</template>
