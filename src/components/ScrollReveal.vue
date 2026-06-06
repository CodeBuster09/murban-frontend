<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  animation: {
    type: String,
    default: 'fade-up' // Options: fade-up, fade-in, scale-up, slide-left, slide-right
  },
  delay: {
    type: String,
    default: '0s' // e.g., '0.1s', '200ms'
  },
  duration: {
    type: String,
    default: '0.8s'
  },
  once: {
    type: Boolean,
    default: true // Trigger animation only once by default
  }
})

const elementRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true
        if (props.once) {
          observer.unobserve(entry.target)
        }
      } else if (!props.once) {
        isVisible.value = false
      }
    })
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -80px 0px' // offset from bottom of screen to trigger slightly late
  })
  
  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div
    ref="elementRef"
    :class="['scroll-reveal-comp', animation, { 'revealed': isVisible }]"
    :style="{
      '--reveal-delay': delay,
      '--reveal-duration': duration
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal-comp {
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: var(--reveal-duration, 0.8s);
  transition-delay: var(--reveal-delay, 0s);
  transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform, opacity;
}

/* Scroll reveal animations */
.fade-up {
  transform: translateY(40px);
}
.fade-up.revealed {
  opacity: 1;
  transform: translateY(0);
}

.fade-in {
  transform: scale(0.96);
}
.fade-in.revealed {
  opacity: 1;
  transform: scale(1);
}

.slide-left {
  transform: translateX(-40px);
}
.slide-left.revealed {
  opacity: 1;
  transform: translateX(0);
}

.slide-right {
  transform: translateX(40px);
}
.slide-right.revealed {
  opacity: 1;
  transform: translateX(0);
}

.scale-up {
  transform: scale(0.9);
}
.scale-up.revealed {
  opacity: 1;
  transform: scale(1);
}
</style>
