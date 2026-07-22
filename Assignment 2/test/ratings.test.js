import assert from 'node:assert/strict'
import test from 'node:test'

function createLocalStorage() {
  const values = new Map()
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
}

globalThis.window = { localStorage: createLocalStorage() }

const ratingsStore = await import('../src/stores/ratings.js')

test('starts with visible aggregated ratings for each resource', () => {
  const summary = ratingsStore.getRatingSummary('grounding-five')
  assert.equal(summary.count, 6)
  assert.equal(summary.average, 28 / 6)
})

test('adds one authenticated user rating to the aggregate', () => {
  const before = ratingsStore.getRatingSummary('grounding-five')
  const result = ratingsStore.submitRating({ resourceId: 'grounding-five', userId: 'member-1', score: 3 })
  const after = ratingsStore.getRatingSummary('grounding-five')

  assert.equal(result.ok, true)
  assert.equal(result.updated, false)
  assert.equal(after.count, before.count + 1)
  assert.equal(after.average, (before.average * before.count + 3) / after.count)
})

test('updates the same user rating without increasing the count', () => {
  const before = ratingsStore.getRatingSummary('grounding-five')
  const result = ratingsStore.submitRating({ resourceId: 'grounding-five', userId: 'member-1', score: 5 })
  const after = ratingsStore.getRatingSummary('grounding-five')

  assert.equal(result.ok, true)
  assert.equal(result.updated, true)
  assert.equal(after.count, before.count)
  assert.equal(ratingsStore.getUserRating('grounding-five', 'member-1'), 5)
})

test('rejects invalid scores and unknown resources', () => {
  assert.equal(ratingsStore.submitRating({ resourceId: 'grounding-five', userId: 'member-2', score: 8 }).ok, false)
  assert.equal(ratingsStore.submitRating({ resourceId: 'unknown', userId: 'member-2', score: 5 }).ok, false)
  assert.equal(ratingsStore.submitRating({ resourceId: 'grounding-five', userId: '', score: 5 }).ok, false)
})
