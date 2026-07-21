<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { resourceCategories, resources } from '../data/resources'
import { readStorage, writeStorage } from '../utils/storage'

const route = useRoute()
const searchQuery = ref(typeof route.query.search === 'string' ? route.query.search.slice(0, 80) : '')
const selectedCategory = ref('All')
const selectedResource = ref(null)
const savedIds = ref(readStorage('mindbridge:savedResources', []))

const filteredResources = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return resources.filter((resource) => {
    const matchesCategory = selectedCategory.value === 'All' || resource.category === selectedCategory.value
    const searchableText = [
      resource.title,
      resource.summary,
      resource.category,
      resource.audience,
      ...resource.keywords,
    ]
      .join(' ')
      .toLocaleLowerCase()

    return matchesCategory && (!query || searchableText.includes(query))
  })
})

function selectCategory(category) {
  selectedCategory.value = category
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}

function toggleSaved(resourceId) {
  savedIds.value = savedIds.value.includes(resourceId)
    ? savedIds.value.filter((id) => id !== resourceId)
    : [...savedIds.value, resourceId]
  writeStorage('mindbridge:savedResources', savedIds.value)
}
</script>

<template>
  <PageIntro
    eyebrow="MENTAL HEALTH RESOURCES"
    title="Find support for how you feel today."
    description="Browse clear, practical resources designed for real moments in everyday life."
  >
    <label class="search-preview">
      <span aria-hidden="true">⌕</span>
      <input
        v-model.trim="searchQuery"
        type="search"
        maxlength="80"
        placeholder="Search anxiety, sleep, family support…"
        aria-label="Search resources"
      />
      <button v-if="searchQuery" class="clear-search" type="button" aria-label="Clear search" @click="searchQuery = ''">×</button>
    </label>
  </PageIntro>

  <section class="section container" aria-labelledby="resource-results-heading">
    <div class="filter-row" aria-label="Resource filters">
      <button
        v-for="category in resourceCategories"
        :key="category"
        type="button"
        :class="{ selected: selectedCategory === category }"
        :aria-pressed="selectedCategory === category"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <div class="results-summary">
      <h2 id="resource-results-heading">{{ filteredResources.length }} helpful {{ filteredResources.length === 1 ? 'resource' : 'resources' }}</h2>
      <span v-if="savedIds.length">{{ savedIds.length }} saved on this device</span>
    </div>

    <div v-if="filteredResources.length" class="resource-grid">
      <article v-for="resource in filteredResources" :key="resource.id" class="resource-card">
        <div class="resource-illustration" :class="`resource-illustration--${resource.color}`" aria-hidden="true">
          {{ resource.icon }}
        </div>
        <div class="resource-card__body">
          <span class="tag">{{ resource.category }}</span>
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.summary }}</p>
          <div class="resource-meta"><span>{{ resource.audience }}</span><span>{{ resource.duration }}</span></div>
          <button class="text-button" type="button" @click="selectedResource = resource">Read overview →</button>
        </div>
        <button
          class="bookmark"
          :class="{ saved: savedIds.includes(resource.id) }"
          type="button"
          :aria-label="`${savedIds.includes(resource.id) ? 'Remove' : 'Save'} ${resource.title}`"
          :aria-pressed="savedIds.includes(resource.id)"
          @click="toggleSaved(resource.id)"
        >
          {{ savedIds.includes(resource.id) ? '♥' : '♡' }}
        </button>
      </article>
    </div>

    <div v-else class="empty-state">
      <span aria-hidden="true">⌕</span>
      <h2>No resources match that search yet.</h2>
      <p>Try a broader word or return to all topics.</p>
      <button class="button button--blue" type="button" @click="clearFilters">Clear filters</button>
    </div>
  </section>

  <div v-if="selectedResource" class="modal-backdrop" role="presentation" @click.self="selectedResource = null">
    <section class="detail-modal" role="dialog" aria-modal="true" :aria-labelledby="`detail-${selectedResource.id}`">
      <button class="modal-close" type="button" aria-label="Close resource overview" @click="selectedResource = null">×</button>
      <div class="detail-modal__icon" :class="`resource-illustration--${selectedResource.color}`" aria-hidden="true">
        {{ selectedResource.icon }}
      </div>
      <span class="tag">{{ selectedResource.category }}</span>
      <h2 :id="`detail-${selectedResource.id}`">{{ selectedResource.title }}</h2>
      <p>{{ selectedResource.summary }}</p>
      <p>
        This short MindBridge guide uses plain language, small practical steps and links to further support when you
        want it.
      </p>
      <div class="resource-meta"><span>{{ selectedResource.audience }}</span><span>{{ selectedResource.duration }}</span></div>
      <button class="button button--blue" type="button" @click="toggleSaved(selectedResource.id)">
        {{ savedIds.includes(selectedResource.id) ? 'Remove from saved' : 'Save for later' }}
      </button>
    </section>
  </div>
</template>
