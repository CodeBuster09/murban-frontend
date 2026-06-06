<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  fillPercent: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1800
  }
})

const elementRef = ref(null)
const displayValue = ref(0)
const hasAnimated = ref(false)
const fillWidth = ref(0)

const startCounter = () => {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const startTime = performance.now()
  const endVal = props.value

  const animate = (now) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const easeProgress = progress * (2 - progress)
    displayValue.value = Math.floor(easeProgress * endVal)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayValue.value = endVal
    }
  }

  requestAnimationFrame(animate)

  // Animate fill bar
  setTimeout(() => {
    fillWidth.value = props.fillPercent
  }, 200)
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter()
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div ref="elementRef" class="metric-item">
    <div class="metric-num">
      {{ displayValue }}<sup>{{ suffix }}</sup>
    </div>
    <div class="metric-label">{{ label }}</div>
    <div class="metric-bar-fill">
      <div class="fill" :style="{ width: fillWidth + '%' }"></div>
    </div>
  </div>
</template>
