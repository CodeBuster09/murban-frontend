<script setup>
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import ScrollReveal from '../components/ScrollReveal.vue'
import MetricCounter from '../components/MetricCounter.vue'
import ServiceCard from '../components/ServiceCard.vue'

const contactEmail = ref('')
const contactMessage = ref('')
const emailError = ref('')
const isSending = ref(false)

const isEmailValid = computed(() => {
  const val = contactEmail.value.trim()
  if (!val) return false
  const re = /^\S+@\S+\.\S+$/
  return re.test(val)
})

const showFallbackToast = (msg = "Thanks — we'll reply to you shortly.") => {
  try {
    const existing = document.querySelector('.app-toast')
    if (existing) existing.remove()

    const div = document.createElement('div')
    div.className = 'app-toast'
    div.textContent = msg
    document.body.appendChild(div)
    setTimeout(() => {
      div.classList.add('app-toast-hidden')
      setTimeout(() => div.remove(), 400)
    }, 3000)
  } catch (e) {
    // ignore
  }
}

const sendContact = async () => {
  const emailVal = contactEmail.value.trim()
  const messageVal = contactMessage.value.trim()

  if (!isEmailValid.value) {
    const errMsg = 'Please enter a valid email address.'
    emailError.value = errMsg
    try {
      if (Notify && typeof Notify.create === 'function') {
        Notify.create({ message: errMsg, color: 'negative', position: 'top-right', timeout: 3000 })
      } else {
        showFallbackToast(errMsg)
      }
    } catch (e) {
      showFallbackToast(errMsg)
    }
    return
  }

  emailError.value = ''
  isSending.value = true
  try {
    const res = await fetch('/feedback', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: emailVal, message: messageVal })
    })

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText || 'Request failed')
      const errMsg = `Failed to send message: ${text}`
      try {
        if (Notify && typeof Notify.create === 'function') {
          Notify.create({ message: errMsg, color: 'negative', position: 'top-right', timeout: 4000 })
        } else {
          showFallbackToast(errMsg)
        }
      } catch (e) {
        showFallbackToast(errMsg)
      }
      return
    }

    try {
      if (Notify && typeof Notify.create === 'function') {
        Notify.create({ message: "Thanks — we'll reply to you shortly.", color: 'positive', position: 'top-right', timeout: 3500 })
      } else {
        showFallbackToast()
      }
    } catch (err) {
      showFallbackToast()
    }

    contactEmail.value = ''
    contactMessage.value = ''
  } catch (err) {
    const errMsg = 'Network error — please try again.'
    try {
      if (Notify && typeof Notify.create === 'function') {
        Notify.create({ message: errMsg, color: 'negative', position: 'top-right', timeout: 4000 })
      } else {
        showFallbackToast(errMsg)
      }
    } catch (e) {
      showFallbackToast(errMsg)
    }
  } finally {
    isSending.value = false
  }
}

const services = [
  { icon: '🎯', title: 'Brand Strategy & Analysis', desc: 'We craft a clear brand identity and competitive analysis to position your business for lasting growth and recognition.' },
  { icon: '💻', title: 'Web Development', desc: 'Fast, responsive, and conversion-focused websites built to represent your brand and turn visitors into customers.' },
  { icon: '🤝', title: 'CRM Solutions', desc: 'Streamline customer relationships with smart CRM systems that keep your team organised and your clients happy.' },
  { icon: '📊', title: 'Lead Management', desc: 'Capture, track, and nurture every lead through a structured pipeline so no opportunity slips through the cracks.' },
  { icon: '📍', title: 'Business Page Setup', desc: 'Get discovered locally with a fully optimised Google My Business profile that builds trust and drives foot traffic.' },
  { icon: '📱', title: 'Social Media & WhatsApp Automation', desc: 'Automate WhatsApp conversations, follow-ups, and social media publishing across all platforms — stay consistent and engage your audience on autopilot.' },
  { icon: '📣', title: 'Meta & Google Ads', desc: 'Run and optimise paid campaigns across Meta and Google Ads to reach the right audience, drive leads, and grow your business with measurable results.' },
  { icon: '🤖', title: 'AI Automation', desc: 'Replace repetitive tasks with intelligent AI workflows that save time, reduce errors, and scale your operations effortlessly.' },
  { icon: '🔍', title: 'SEO', desc: 'Rank higher on Google with proven on-page and off-page SEO strategies that bring consistent, organic traffic to your site.' }
]

const processSteps = [
  { num: '01', title: 'DISCOVERY', desc: 'Deep dive into your brand, audience, and goals. We align on vision before touching a single pixel.', duration: '1–2 WEEKS' },
  { num: '02', title: 'DESIGN', desc: 'High-fidelity mockups and interactive prototypes. Every element is meticulously crafted for visual impact.', duration: '2–4 WEEKS' },
  { num: '03', title: 'DEVELOP', desc: 'Production-grade code with modern frameworks. Performance-optimized, accessible, and rigorously tested.', duration: '4–8 WEEKS' },
  { num: '04', title: 'DELIVER', desc: 'Launch, iterate, and grow. Ongoing support, analytics review, and continuous optimization post-launch.', duration: 'ONGOING' }
]

const testimonials = [
  { text: 'MURBAN transformed our digital presence. Their attention to micro-interactions and performance optimisation increased our conversion rate by 180% within three months.', name: 'Riya Kapoor', role: 'Founder, Nayi Ventures', initials: 'RK' },
  { text: 'Working with MURBAN felt like having an in-house design team that truly understands engineering. The codebase they delivered is the cleanest I\'ve seen.', name: 'Arjun Mehta', role: 'Head, AgriSense', initials: 'AM' },
  { text: 'They didn\'t just build us a website — they crafted a digital experience. Every interaction feels intentional; our clients constantly ask who designed it.', name: 'Priya Nair', role: 'Creative Head, Studio Bloom', initials: 'PN' },
  { text: 'We saw immediate ROI. Within two months of launch, qualified leads doubled and our bounce rate dropped by 45%. MURBAN delivers measurable results.', name: 'Vikram Singh', role: 'Head, Elevate Commerce', initials: 'VS' }
]

const metrics = [
  { value: 20, suffix: '+', label: 'Projects Delivered', fill: 92 },
  { value: 98, suffix: '%', label: 'Client Retention', fill: 98 },
  { value: 12, suffix: '+', label: 'Clients Served', fill: 60 },
  { value: 10, suffix: '+', label: 'Active Projects', fill: 30 }
]

const tickerItems = [
  'WEB DESIGN', 'BRANDING', 'DEVELOPMENT', 'UI/UX', 'E-COMMERCE',
  'MOTION DESIGN', 'SEO STRATEGY', 'CREATIVE DIRECTION',
  'WEB DESIGN', 'BRANDING', 'DEVELOPMENT', 'UI/UX', 'E-COMMERCE',
  'MOTION DESIGN', 'SEO STRATEGY', 'CREATIVE DIRECTION'
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
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>

      <div class="hero-content">
        <ScrollReveal animation="fade-up" delay="0s">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            AVAILABLE FOR PROJECTS
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.08s">
          <h1>
            WE CRAFT<br>
            <span class="accent-text">DIGITAL</span><br>
            <span class="outline">EXPERIENCES</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.16s">
          <p class="hero-sub">
            Strategy-driven web design &amp; development studio focused on creating
            measurable impact through bold digital solutions.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.24s">
          <div class="hero-actions">
            <a href="#contact" class="btn-primary">START A PROJECT</a>
            <a href="#services" class="btn-ghost">VIEW WORK</a>
          </div>
        </ScrollReveal>
      </div>

      <div class="hero-scroll">
        <span class="scroll-line"></span>
        SCROLL TO EXPLORE
      </div>
    </section>

    <!-- Metrics Bar -->
    <div class="metrics-bar">
      <MetricCounter
        v-for="(m, i) in metrics"
        :key="i"
        :value="m.value"
        :suffix="m.suffix"
        :label="m.label"
        :fill-percent="m.fill"
      />
    </div>

    <!-- Ticker Marquee -->
    <div class="ticker-wrap">
      <div class="ticker-inner">
        <span v-for="(item, i) in tickerItems" :key="i" class="ticker-item">
          <span class="dot"></span>
          {{ item }}
        </span>
      </div>
    </div>

    <!-- Services Section -->
    <section id="services">
      <div class="section-label reveal">WHAT WE DO</div>
      <h2 class="section-title reveal reveal-delay-1">
        SERVICES <span class="dim">THAT DRIVE</span><br>
        RESULTS
      </h2>

      <div class="services-grid">
        <ServiceCard
          v-for="(s, i) in services"
          :key="i"
          :icon="s.icon"
          :title="s.title"
          :description="s.desc"
        />
      </div>
    </section>

    <!-- Process Section -->
    <section id="process">
      <div class="section-label reveal">HOW WE WORK</div>
      <h2 class="section-title reveal reveal-delay-1">
        OUR <span class="dim">PROVEN</span><br>
        PROCESS
      </h2>

      <div class="process-list">
        <div
          v-for="(step, i) in processSteps"
          :key="i"
          class="process-step reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <div class="step-num">{{ step.num }}</div>
          <div>
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials">
      <div class="section-label reveal">CLIENT STORIES</div>
      <h2 class="section-title reveal reveal-delay-1">
        TRUSTED <span class="dim">BY THE</span><br>
        BEST
      </h2>

      <div class="testimonials-grid">
        <div
          v-for="(t, i) in testimonials"
          :key="i"
          class="testimonial-card reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <p class="testimonial-text">{{ t.text }}</p>
          <div class="testimonial-author">
            <div class="author-avatar">{{ t.initials }}</div>
            <div>
              <div class="author-name">{{ t.name }}</div>
              <div class="author-role">{{ t.role }}</div>
            </div>
          </div>
          <div class="stars">★★★★★</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="cta-section">
      <div class="cta-inner">
        <ScrollReveal animation="fade-up" delay="0s">
          <h2 class="cta-title big">GET IN TOUCH</h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay="0.12s">
          <form class="cta-form" @submit.prevent="sendContact">
            <input id="contact-email" type="email" placeholder="Enter your email" v-model="contactEmail" :class="['cta-input', { error: emailError }]" @input="emailError = ''" />
            <div v-if="emailError" class="cta-error-message">{{ emailError }}</div>
            <textarea id="contact-message" placeholder="Your question or feedback (optional)" v-model="contactMessage" class="cta-textarea"></textarea>

            <button type="submit" class="send-btn" :disabled="!isEmailValid || isSending">
              <span class="send-label">Send</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  </div>
</template>
