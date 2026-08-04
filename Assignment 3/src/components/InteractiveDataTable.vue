<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { exportRowsToCsv } from '../utils/exportCsv'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  filename: { type: String, required: true },
})

const globalSearch = ref('')
const columnSearch = reactive(Object.fromEntries(props.columns.map((column) => [column.key, ''])))
const sortKey = ref(props.columns[0].key)
const sortDirection = ref('asc')
const currentPage = ref(1)
const rowsPerPage = 10

const filteredRows = computed(() => {
  const globalNeedle = globalSearch.value.trim().toLowerCase()
  return props.rows.filter((row) => {
    const matchesGlobal = !globalNeedle || props.columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(globalNeedle))
    const matchesColumns = props.columns.every((column) => {
      const needle = columnSearch[column.key].trim().toLowerCase()
      return !needle || String(row[column.key] ?? '').toLowerCase().includes(needle)
    })
    return matchesGlobal && matchesColumns
  })
})

const sortedRows = computed(() => [...filteredRows.value].sort((left, right) => {
  const leftValue = left[sortKey.value]
  const rightValue = right[sortKey.value]
  const comparison = typeof leftValue === 'number'
    ? leftValue - rightValue
    : String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, { numeric: true })
  return sortDirection.value === 'asc' ? comparison : -comparison
}))

const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / rowsPerPage)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return sortedRows.value.slice(start, start + rowsPerPage)
})

watch([globalSearch, () => Object.values(columnSearch)], () => { currentPage.value = 1 }, { deep: true })

function toggleSort(key) {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function clearFilters() {
  globalSearch.value = ''
  Object.keys(columnSearch).forEach((key) => { columnSearch[key] = '' })
}
</script>

<template>
  <section class="data-table-card" :aria-labelledby="`${filename}-title`">
    <div class="data-table-heading">
      <div>
        <h2 :id="`${filename}-title`">{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <button class="button button--blue" type="button" @click="exportRowsToCsv(`${filename}.csv`, columns, sortedRows)">
        Export filtered CSV
      </button>
    </div>

    <div class="table-toolbar">
      <label>
        Search all columns
        <input v-model="globalSearch" type="search" :aria-label="`Search all columns in ${title}`" placeholder="Search this table…" />
      </label>
      <button class="button button--outline" type="button" @click="clearFilters">Clear filters</button>
    </div>

    <div class="table-scroll" tabindex="0" :aria-label="`${title}, horizontally scrollable`">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" scope="col" :aria-sort="sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
              <button type="button" @click="toggleSort(column.key)">
                {{ column.label }}
                <span aria-hidden="true">{{ sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </button>
            </th>
          </tr>
          <tr class="column-filters">
            <th v-for="column in columns" :key="column.key">
              <label>
                <span class="sr-only">Search {{ column.label }}</span>
                <input v-model="columnSearch[column.key]" type="search" :placeholder="`Search ${column.label}`" />
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row.id">
            <td v-for="column in columns" :key="column.key" :data-label="column.label">{{ row[column.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="paginatedRows.length === 0" class="table-empty" role="status">No matching rows. Clear or change your filters.</div>
    <div class="table-pagination" aria-live="polite">
      <p>Showing {{ paginatedRows.length }} of {{ sortedRows.length }} matching rows · Page {{ currentPage }} of {{ pageCount }}</p>
      <div>
        <button type="button" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <button type="button" :disabled="currentPage === pageCount" @click="currentPage++">Next</button>
      </div>
    </div>
  </section>
</template>
