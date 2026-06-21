<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="testimonial-card">
    <p class="testimonial-text">{{ text }}</p>
    <div class="testimonial-footer">
      <div class="testimonial-author">
        <div class="author-avatar">{{ initials }}</div>
        <div class="author-info">
          <div class="author-name">{{ name }}</div>
          <div class="author-role">{{ role }}</div>
        </div>
      </div>
      <div class="testimonial-stars" aria-hidden="true">★★★★★</div>
    </div>
  </div>
</template>
