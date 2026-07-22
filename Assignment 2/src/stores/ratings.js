import { computed, ref } from 'vue'
import { resources } from '../data/resources.js'
import { isValidRating } from '../utils/security.js'
import { readStorage, writeStorage } from '../utils/storage.js'

const RATINGS_KEY = 'mindbridge:ratings'

const seedScores = {
  'grounding-five': [5, 5, 4, 5, 4, 5],
  'better-sleep': [5, 4, 5, 4, 5],
  'big-feelings': [5, 5, 5, 4, 5, 5],
  'focus-matters': [4, 5, 4, 4],
  'not-alone': [5, 4, 5, 5, 4],
  'self-care-checklist': [4, 5, 5, 4, 5],
  'career-comparison': [5, 4, 5, 4],
  'warning-signs': [5, 5, 4, 5],
  'settling-australia': [4, 5, 5, 5],
}

function createSeedRatings() {
  return resources.flatMap((resource) =>
    (seedScores[resource.id] ?? [4, 5, 5]).map((score, index) => ({
      id: `seed-${resource.id}-${index}`,
      resourceId: resource.id,
      userId: `seed-user-${index}`,
      score,
      createdAt: '2026-07-01T00:00:00.000Z',
    })),
  )
}

function isValidRecord(record) {
  return Boolean(
    record &&
      typeof record.id === 'string' &&
      typeof record.resourceId === 'string' &&
      typeof record.userId === 'string' &&
      isValidRating(record.score),
  )
}

const storedRatings = readStorage(RATINGS_KEY, null)
const ratings = ref(
  Array.isArray(storedRatings) && storedRatings.every(isValidRecord) ? storedRatings : createSeedRatings(),
)

if (!Array.isArray(storedRatings) || !storedRatings.every(isValidRecord)) {
  writeStorage(RATINGS_KEY, ratings.value)
}

const ratingCount = computed(() => ratings.value.length)

export function getRatingSummary(resourceId) {
  const matchingRatings = ratings.value.filter((rating) => rating.resourceId === resourceId)
  const total = matchingRatings.reduce((sum, rating) => sum + rating.score, 0)
  return {
    average: matchingRatings.length ? total / matchingRatings.length : 0,
    count: matchingRatings.length,
  }
}

export function getUserRating(resourceId, userId) {
  return ratings.value.find((rating) => rating.resourceId === resourceId && rating.userId === userId)?.score ?? 0
}

export function submitRating({ resourceId, userId, score }) {
  if (!resources.some((resource) => resource.id === resourceId) || !userId || !isValidRating(score)) {
    return { ok: false, message: 'Choose a valid rating from 1 to 5.' }
  }

  const existingRating = ratings.value.find(
    (rating) => rating.resourceId === resourceId && rating.userId === userId,
  )

  if (existingRating) {
    existingRating.score = score
    existingRating.updatedAt = new Date().toISOString()
  } else {
    ratings.value.push({
      id: crypto.randomUUID(),
      resourceId,
      userId,
      score,
      createdAt: new Date().toISOString(),
    })
  }

  writeStorage(RATINGS_KEY, ratings.value)
  return { ok: true, updated: Boolean(existingRating) }
}

export function useRatings() {
  return {
    ratings,
    ratingCount,
    getRatingSummary,
    getUserRating,
    submitRating,
  }
}

