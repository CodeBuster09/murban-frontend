<script setup>
import { onMounted } from 'vue'
import ScrollReveal from '../components/ScrollReveal.vue'

const plans = [
  {
    id: 'mbasic',
    name: 'MBASIC',
    tagline: 'Essential web presence',
    features: [
      { icon: '💻', label: 'Web Development' }
    ],
    optional: ['Maintenance — additional costs'],
    cta: 'Get Started',
    ctaLink: '/#contact',
    featured: false
  },
  {
    id: 'mpremium',
    name: 'MPREMIUM',
    tagline: 'Smart automation included',
    features: [
      { icon: '💻', label: 'Web Development' },
      { icon: '💬', label: 'Chatbot' },
      { icon: '🤖', label: 'AI Automation' }
    ],
    cta: 'Get Started',
    ctaLink: '/#contact',
    featured: true
  },
  {
    id: 'melite',
    name: 'MELITE',
    tagline: 'Full-stack digital suite',
    features: [
      { icon: '💻', label: 'Web Development' },
      { icon: '💬', label: 'Chatbot' },
      { icon: '🤖', label: 'AI Automation' },
      { icon: '🤝', label: 'CRM' }
    ],
    cta: 'Get Started',
    ctaLink: '/#contact',
    featured: false
  },
  {
    id: 'custom',
    name: 'MURBAN CUSTOM',
    tagline: 'Built for your business',
    features: [
      { icon: '✦', label: 'Tailored services for businesses with unique needs' }
    ],
    isCustom: true,
    cta: 'Send Inquiry',
    ctaLink: '/#contact',
    featured: false
  }
]

const setupReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' })

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
    observer.observe(el)
  })
}

onMounted(() => {
  setTimeout(setupReveal, 100)
})
</script>

<template>
  <div class="plans-page">
    <section class="plans-hero">
      <div class="plans-hero-bg"></div>
      <div class="plans-hero-grid"></div>

      <div class="plans-hero-content">
        <ScrollReveal animation="fade-up" delay="0s">
          <div class="section-label">PRICING</div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.08s">
          <h1 class="plans-hero-title">
            CHOOSE YOUR<br>
            <span class="accent-text">PLAN</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.16s">
          <p class="plans-hero-sub">
            From essential web development to full AI-powered business automation —
            pick the package that fits your growth stage.
          </p>
        </ScrollReveal>
      </div>
    </section>

    <section class="plans-section">
      <div class="plans-grid">
        <div
          v-for="(plan, i) in plans"
          :key="plan.id"
          class="plan-card reveal"
          :class="[
            'reveal-delay-' + (i + 1),
            { 'plan-card--featured': plan.featured, 'plan-card--custom': plan.isCustom }
          ]"
        >
          <div v-if="plan.featured" class="plan-badge">MOST POPULAR</div>

          <div class="plan-info">
            <div class="plan-header">
              <h2 class="plan-name">{{ plan.name }}</h2>
              <p class="plan-tagline">{{ plan.tagline }}</p>
            </div>

            <div class="plan-features-wrap">
              <ul class="plan-features">
                <li
                  v-for="(feature, fi) in plan.features"
                  :key="fi"
                  class="plan-feature-chip"
                  :class="{ 'plan-feature-chip--wide': plan.isCustom }"
                >
                  <span class="plan-feature-icon">{{ feature.icon }}</span>
                  <span class="plan-feature-label">{{ feature.label }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="plan-actions">
            <ul v-if="plan.optional" class="plan-optional">
              <li v-for="(item, oi) in plan.optional" :key="oi">
                <span class="plan-optional-icon">+</span>
                <span>
                  <span class="plan-optional-label">Optional:</span>
                  {{ item }}
                </span>
              </li>
            </ul>

            <a :href="plan.ctaLink" class="plan-cta" :class="{ 'btn-primary': plan.featured, 'btn-ghost': !plan.featured }">
              {{ plan.cta }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
