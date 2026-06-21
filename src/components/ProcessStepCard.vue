<script setup>
defineProps({
  num: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="process-step-card">
    <div class="process-step-badge" aria-hidden="true">{{ num }}</div>
    <h3 class="process-step-title">{{ title }}</h3>
    <p class="process-step-desc">{{ description }}</p>
  </div>
</template>
