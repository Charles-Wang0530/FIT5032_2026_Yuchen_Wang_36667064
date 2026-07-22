<script setup>
import { computed, ref } from 'vue'
import { events } from '../data/events'
import { resources } from '../data/resources'
import { useAuth } from '../stores/auth'

const { currentUser, publicUsers, updateUserRole } = useAuth()
const statusMessage = ref('')

const memberCount = computed(() => publicUsers.value.filter((user) => user.role !== 'admin').length)
const familyCount = computed(() => publicUsers.value.filter((user) => user.role === 'family').length)

function changeRole(userId, role) {
  const changed = updateUserRole(userId, role)
  statusMessage.value = changed ? 'Account role updated.' : 'This role could not be changed.'
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString))
}
</script>

<template>
  <section class="admin-page">
    <div class="container admin-hero">
      <div><p class="eyebrow">ADMIN ONLY</p><h1>MindBridge workspace</h1><p>Signed in as {{ currentUser.name }}. This page is protected by an administrator role check.</p></div>
      <span aria-hidden="true">⚙</span>
    </div>

    <div class="section container">
      <div class="admin-stats">
        <article><strong>{{ memberCount }}</strong><span>Member accounts</span></article>
        <article><strong>{{ familyCount }}</strong><span>Family supporters</span></article>
        <article><strong>{{ resources.length }}</strong><span>Published resources</span></article>
        <article><strong>{{ events.length }}</strong><span>Upcoming events</span></article>
      </div>

      <section class="admin-panel" aria-labelledby="account-management-heading">
        <div class="section-heading section-heading--compact">
          <div><p class="eyebrow">ACCOUNT MANAGEMENT</p><h2 id="account-management-heading">Registered users</h2></div>
          <p>Change authorisation levels without exposing stored password hashes.</p>
        </div>
        <p v-if="statusMessage" class="success-message" role="status">{{ statusMessage }}</p>
        <div class="account-table-wrap">
          <table class="account-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th></tr></thead>
            <tbody>
              <tr v-for="user in publicUsers" :key="user.id">
                <td>{{ user.name }} <span v-if="user.id === currentUser.id" class="you-label">You</span></td>
                <td>{{ user.email }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <select :value="user.role" :disabled="user.id === currentUser.id" :aria-label="`Role for ${user.name}`" @change="changeRole(user.id, $event.target.value)">
                    <option value="user">Individual user</option>
                    <option value="family">Family supporter</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </section>
</template>

