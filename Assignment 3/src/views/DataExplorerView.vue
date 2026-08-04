<script setup>
import InteractiveDataTable from '../components/InteractiveDataTable.vue'
import PageIntro from '../components/PageIntro.vue'
import { eventColumns, eventTableRows, resourceColumns, resourceTableRows } from '../data/tableData'
</script>

<template>
  <PageIntro
    eyebrow="COMMUNITY DATA"
    title="Explore services with confidence."
    description="Search, compare and export MindBridge resource and event information using accessible interactive tables."
    tone="blue"
  />
  <div class="section container data-explorer-stack">
    <InteractiveDataTable
      title="Resource catalogue"
      description="Published and upcoming wellbeing content available through MindBridge."
      :columns="resourceColumns"
      :rows="resourceTableRows"
      filename="mindbridge-resources"
    />
    <InteractiveDataTable
      title="Community event schedule"
      description="Upcoming workshops, family sessions, training and community meetups."
      :columns="eventColumns"
      :rows="eventTableRows"
      filename="mindbridge-events"
    />
  </div>
</template>
