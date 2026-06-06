<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Notify } from 'quasar'
import ScrollReveal from './components/ScrollReveal.vue'
import MetricCounter from './components/MetricCounter.vue'
import ServiceCard from './components/ServiceCard.vue'

// ─── Custom Cursor ───
const cursorX = ref(-100)
const cursorY = ref(-100)
const ringX = ref(-100)
const ringY = ref(-100)
const cursorHover = ref(false)

let ringRAF = null
const onMouseMove = (e) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY

  // Smooth ring follow
  const lerp = () => {
    ringX.value += (cursorX.value - ringX.value) * 0.15
    ringY.value += (cursorY.value - ringY.value) * 0.15
    ringRAF = requestAnimationFrame(lerp)
  }
  if (!ringRAF) lerp()
}

const onMouseOver = (e) => {
  if (e.target.closest('a, button, .btn-primary, .btn-ghost, .nav-links a')) {
    cursorHover.value = true
  }
}
const onMouseOut = (e) => {
  if (e.target.closest('a, button, .btn-primary, .btn-ghost, .nav-links a')) {
    cursorHover.value = false
  }
}

// ─── Nav Scroll State ───
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 60
}

// ─── Mobile Drawer ───
const drawerOpen = ref(false)

// ─── Contact CTA state ───
const contactEmail = ref('')
const contactMessage = ref('')
const emailError = ref('')
const isSending = ref(false)

const isEmailValid = computed(() => {
  const val = contactEmail.value.trim()
  if (!val) return false
  // simple email regex
  const re = /^\S+@\S+\.\S+$/
  return re.test(val)
})
// Fallback toast if Quasar Notify isn't available or fails
const showFallbackToast = (msg = "Thanks — we'll reply to you shortly.") => {
  try {
    const existing = document.querySelector('.app-toast')
    if (existing) existing.remove()

    const div = document.createElement('div')
    div.className = 'app-toast'
    div.textContent = msg
    document.body.appendChild(div)
    // auto remove
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

  // validate email before proceeding
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

  // clear any previous error
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

    // success
    try {
      if (Notify && typeof Notify.create === 'function') {
        Notify.create({ message: "Thanks — we'll reply to you shortly.", color: 'positive', position: 'top-right', timeout: 3500 })
      } else {
        showFallbackToast()
      }
    } catch (err) {
      showFallbackToast()
    }

    // clear the form locally
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

// ─── Data ───
const services = [
  { icon: '🎨', title: 'BRAND STRATEGY', desc: 'We shape brand identities that resonate, crafting visual language and positioning that sets you apart in competitive markets.' },
  { icon: '💻', title: 'WEB DESIGN', desc: 'Pixel-perfect interfaces designed for conversion. Every layout decision is informed by user research and aesthetic mastery.' },
  { icon: '⚡', title: 'DEVELOPMENT', desc: 'High-performance frontend engineering with Vue, React, and modern frameworks. Clean code that scales effortlessly.' },
  { icon: '📱', title: 'MOBILE FIRST', desc: 'Responsive experiences that feel native on every device. Touch-optimized interactions and fluid adaptive layouts.' },
  { icon: '🔍', title: 'SEO & GROWTH', desc: 'Technical SEO, performance audits, and growth engineering. We ensure your digital presence reaches its audience.' },
  { icon: '🚀', title: 'LAUNCH & SCALE', desc: 'From MVP to enterprise. CI/CD pipelines, monitoring, and iterative improvement to sustain your growth trajectory.' }
]

const processSteps = [
  { num: '01', title: 'DISCOVERY', desc: 'Deep dive into your brand, audience, and goals. We align on vision before touching a single pixel.', duration: '1–2 WEEKS' },
  { num: '02', title: 'DESIGN', desc: 'High-fidelity mockups and interactive prototypes. Every element is meticulously crafted for visual impact.', duration: '2–4 WEEKS' },
  { num: '03', title: 'DEVELOP', desc: 'Production-grade code with modern frameworks. Performance-optimized, accessible, and rigorously tested.', duration: '4–8 WEEKS' },
  { num: '04', title: 'DELIVER', desc: 'Launch, iterate, and grow. Ongoing support, analytics review, and continuous optimization post-launch.', duration: 'ONGOING' }
]

const testimonials = [
  { text: 'MURBAN transformed our entire digital presence. The attention to micro-interactions and performance optimization was extraordinary. Our conversion rate increased by 340% within the first quarter.', name: 'Elena Vasquez', role: 'CEO, Nexus Ventures', initials: 'EV' },
  { text: 'Working with MURBAN felt like having an in-house design team that actually understands engineering. The codebase they delivered is the cleanest I have ever seen in 15 years of tech.', name: 'James Thornton', role: 'CTO, Helix Labs', initials: 'JT' },
  { text: 'They did not just build us a website — they crafted a digital experience. Every scroll, every hover, every transition feels intentional. Our clients constantly ask who designed our site.', name: 'Sarah Kim', role: 'Creative Director, Prism Agency', initials: 'SK' },
  { text: 'The ROI was immediate. Within two months of launching the new site, our qualified leads tripled and our bounce rate dropped by 60%. MURBAN delivers results, not just pixels.', name: 'Marcus Chen', role: 'VP Marketing, AeroStack', initials: 'MC' }
]

const metrics = [
  { value: 142, suffix: '+', label: 'Projects Delivered', fill: 92 },
  { value: 98, suffix: '%', label: 'Client Retention', fill: 98 },
  { value: 30, suffix: '+', label: 'Design Awards', fill: 78 },
  { value: 10, suffix: '+', label: 'Years Experience', fill: 88 }
]

const tickerItems = [
  'WEB DESIGN', 'BRANDING', 'DEVELOPMENT', 'UI/UX', 'E-COMMERCE',
  'MOTION DESIGN', 'SEO STRATEGY', 'CREATIVE DIRECTION',
  'WEB DESIGN', 'BRANDING', 'DEVELOPMENT', 'UI/UX', 'E-COMMERCE',
  'MOTION DESIGN', 'SEO STRATEGY', 'CREATIVE DIRECTION'
]

// ─── Scroll Reveal via IntersectionObserver ───
const revealElements = ref([])

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

// ─── Lifecycle ───
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseover', onMouseOver)
  window.addEventListener('mouseout', onMouseOut)
  window.addEventListener('scroll', onScroll)
  onScroll()

  // Setup reveal after render
  setTimeout(setupReveal, 100)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseover', onMouseOver)
  window.removeEventListener('mouseout', onMouseOut)
  window.removeEventListener('scroll', onScroll)
  if (ringRAF) cancelAnimationFrame(ringRAF)
})
</script>

<template>
  <q-layout :class="{ 'cursor-hover': cursorHover }">
    <!-- Custom Cursor -->
    <div class="cursor-dot" :style="{ left: cursorX + 'px', top: cursorY + 'px' }"></div>
    <div class="cursor-ring" :style="{ left: ringX + 'px', top: ringY + 'px' }"></div>

    <!-- Navigation -->
    <nav class="murban-nav" :class="{ scrolled }">
      <a href="#" class="logo">MURBAN</a>

      <ul class="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#process">Process</a></li>
        <li><a href="#testimonials">Testimonials</a></li>

      </ul>

      <a href="#contact" class="btn-primary gt-sm">START A PROJECT</a>

      <!-- Mobile Menu Button -->
      <q-btn
        flat dense round
        icon="menu"
        class="lt-md text-white"
        @click="drawerOpen = !drawerOpen"
        style="cursor: none;"
      />
    </nav>

    <!-- Mobile Drawer -->
    <q-drawer
      v-model="drawerOpen"
      side="right"
      overlay
      behavior="mobile"
      :width="280"
      class="bg-dark text-white"
      style="border-left: 1px solid rgba(255,255,255,0.07);"
    >
      <q-scroll-area class="fit q-pa-lg">
        <div class="flex justify-between items-center q-mb-xl">
          <div style="font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 0.1em;">MURBAN</div>
          <q-btn flat dense round icon="close" @click="drawerOpen = false" />
        </div>
        <q-list>
          <q-item clickable v-ripple href="#services" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Services</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="#process" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Process</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="#testimonials" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Testimonials</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="#contact" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1 text-primary text-weight-bold">Start a Project</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

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

    <!-- CTA Section (converted to centered contact form) -->
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

    <!-- Footer -->
    <footer class="murban-footer">
      <div class="footer-copy">© 2026 MURBAN Studio. All rights reserved.</div>
      <div class="footer-right">
       
        <div class="footer-links footer-social">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 2 6.48 2 12.07c0 4.98 3.66 9.11 8.44 9.95v-7.04H8.13v-2.91h2.31V9.41c0-2.28 1.36-3.54 3.44-3.54.99 0 2.02.18 2.02.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.91h-2.1V22c4.78-.84 8.44-4.97 8.44-9.93z" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/murban.ai" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.1A4.9 4.9 0 1 0 16.9 13 4.9 4.9 0 0 0 12 8.1zm6.4-3.5a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2z" fill="currentColor"/>
            <circle cx="12" cy="13" r="2.9" fill="currentColor" />
          </svg>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="social-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.1 1.53-1.9-.67.4-1.4.7-2.18.86A3.6 3.6 0 0 0 12 8.5c0 .28.03.56.1.82-3-.15-5.68-1.6-7.47-3.79-.31.53-.49 1.15-.49 1.8 0 1.24.63 2.33 1.6 2.97-.58-.02-1.12-.18-1.6-.45v.05c0 1.73 1.23 3.17 2.86 3.5-.3.08-.62.12-.95.12-.23 0-.45-.02-.67-.06.45 1.4 1.76 2.42 3.3 2.45A7.22 7.22 0 0 1 4 19.54a10.2 10.2 0 0 0 5.54 1.62c6.65 0 10.3-5.5 10.3-10.28v-.47c.7-.5 1.3-1.12 1.78-1.83-.64.28-1.32.47-2.03.55z" fill="currentColor"/>
          </svg>
        </a>
      </div>
       <div class="footer-contact">
        <span class="contact-label">For enquiries:</span>
          <a href="mailto:murban.advert@gmail.com" class="footer-email">murban.advert@gmail.com</a>
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<style>
/* Layout overrides for Quasar */
.q-layout {
  background: var(--bg) !important;
}

.q-page-container {
  padding-top: 0 !important;
}

.q-drawer {
  background: var(--bg) !important;
}
</style>
