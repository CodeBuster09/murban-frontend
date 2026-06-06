<script setup>
defineProps({
  num: {
    type: String,
    required: true
  },
  icon: {
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
  <div class="service-card">
    <div style="display: flex; gap: 1rem;">
      <div class="service-icon">{{ icon }}</div>
      <div class="service-title">{{ title }}</div>
    </div>
    <div class="service-desc">{{ description }}</div>
    <span class="service-arrow">↗</span>
  </div>
</template>
