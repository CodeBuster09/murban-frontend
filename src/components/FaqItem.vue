<script setup>
defineProps({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  aBefore: {
    type: String,
    default: ''
  },
  aAfter: {
    type: String,
    default: ''
  },
  plansLink: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<template>
  <div class="faq-item" :class="{ 'faq-open': open }">
    <button
      type="button"
      class="faq-question"
      :aria-expanded="open"
      @click="$emit('toggle')"
    >
      <span>{{ question }}</span>
      <span class="faq-icon" aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <div class="faq-answer-wrap">
      <div class="faq-answer">
        <p v-if="plansLink">
          {{ aBefore }}<router-link to="/plans" class="faq-link">Plans page</router-link>{{ aAfter }}
        </p>
        <p v-else>{{ answer }}</p>
      </div>
    </div>
  </div>
</template>
