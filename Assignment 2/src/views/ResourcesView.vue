<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { resourceCategories, resources } from '../data/resources'
import { useAuth } from '../stores/auth'
import { useRatings } from '../stores/ratings'
import { readStorage, writeStorage } from '../utils/storage'

const route = useRoute()
const { currentUser, isAuthenticated } = useAuth()
const { getRatingSummary, getUserRating, submitRating } = useRatings()
const searchQuery = ref(typeof route.query.search === 'string' ? route.query.search.slice(0, 80) : '')
const selectedCategory = ref('All')
const selectedResource = ref(null)
const savedIds = ref(readStorage('mindbridge:savedResources', []))
const ratingSelection = ref(0)
const ratingMessage = ref('')

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

function openResource(resource) {
  selectedResource.value = resource
  ratingSelection.value = currentUser.value ? getUserRating(resource.id, currentUser.value.id) : 0
  ratingMessage.value = ''
}

function closeResource() {
  selectedResource.value = null
  ratingSelection.value = 0
  ratingMessage.value = ''
}

function saveRating() {
  if (!selectedResource.value || !currentUser.value) return
  const result = submitRating({
    resourceId: selectedResource.value.id,
    userId: currentUser.value.id,
    score: ratingSelection.value,
  })
  ratingMessage.value = result.ok
    ? result.updated
      ? 'Your rating was updated. The new average is shown below.'
      : 'Thank you. Your rating is now included in the average.'
    : result.message
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
          <div class="aggregated-rating" :aria-label="`${getRatingSummary(resource.id).average.toFixed(1)} out of 5 from ${getRatingSummary(resource.id).count} ratings`">
            <span aria-hidden="true">★</span>
            <strong>{{ getRatingSummary(resource.id).average.toFixed(1) }}</strong>
            <small>{{ getRatingSummary(resource.id).count }} ratings</small>
          </div>
          <button class="text-button" type="button" @click="openResource(resource)">Read and rate →</button>
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

  <div v-if="selectedResource" class="modal-backdrop" role="presentation" @click.self="closeResource">
    <section class="detail-modal" role="dialog" aria-modal="true" :aria-labelledby="`detail-${selectedResource.id}`">
      <button class="modal-close" type="button" aria-label="Close resource overview" @click="closeResource">×</button>
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

      <section class="rating-panel" aria-labelledby="rating-panel-heading">
        <p class="eyebrow">COMMUNITY HELPFULNESS</p>
        <h3 id="rating-panel-heading">How helpful was this resource?</h3>
        <div class="rating-summary-large">
          <strong>{{ getRatingSummary(selectedResource.id).average.toFixed(1) }}</strong>
          <div><span aria-hidden="true">★★★★★</span><small>Average from {{ getRatingSummary(selectedResource.id).count }} ratings</small></div>
        </div>

        <template v-if="isAuthenticated">
          <div class="star-buttons" role="group" aria-label="Choose a rating from 1 to 5 stars">
            <button
              v-for="score in 5"
              :key="score"
              type="button"
              :class="{ selected: score <= ratingSelection }"
              :aria-label="`Rate ${score} ${score === 1 ? 'star' : 'stars'}`"
              :aria-pressed="ratingSelection === score"
              @click="ratingSelection = score"
            >
              ★
            </button>
          </div>
          <button class="button button--blue" type="button" :disabled="!ratingSelection" @click="saveRating">
            {{ getUserRating(selectedResource.id, currentUser.id) ? 'Update my rating' : 'Submit my rating' }}
          </button>
          <p v-if="ratingMessage" class="success-message" role="status">{{ ratingMessage }}</p>
        </template>
        <div v-else class="rating-sign-in">
          <p>Sign in to add one rating per account and help other users.</p>
          <RouterLink class="button button--outline" :to="{ name: 'login', query: { redirect: route.fullPath } }">Sign in to rate</RouterLink>
        </div>
      </section>
    </section>
  </div>
</template>
