<script setup>
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import ScrollReveal from '../components/ScrollReveal.vue'
import MetricCounter from '../components/MetricCounter.vue'
import ServiceCard from '../components/ServiceCard.vue'
import ProcessStepCard from '../components/ProcessStepCard.vue'
import TestimonialCard from '../components/TestimonialCard.vue'

const contactEmail = ref('')
const contactMessage = ref('')
const contactHoneypot = ref('')
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
    const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
    const res = await fetch(`${apiBase}/feedback`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: emailVal, message: messageVal, website: contactHoneypot.value })
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
  { icon: 'strategy', title: 'Brand Strategy & Analysis', desc: 'We craft a clear brand identity and competitive analysis to position your business for lasting growth and recognition.' },
  { icon: 'web', title: 'Web Development', desc: 'Fast, responsive, and conversion-focused websites built to represent your brand and turn visitors into customers.' },
  { icon: 'crm', title: 'CRM Solutions', desc: 'Streamline customer relationships with smart CRM systems that keep your team organised and your clients happy.' },
  { icon: 'leads', title: 'Lead Management', desc: 'Capture, track, and nurture every lead through a structured pipeline so no opportunity slips through the cracks.' },
  { icon: 'local', title: 'Business Page Setup', desc: 'Get discovered locally with a fully optimised Google My Business profile that builds trust and drives foot traffic.' },
  { icon: 'social', title: 'Social Media & WhatsApp Automation', desc: 'Automate WhatsApp conversations, follow-ups, and social media publishing across all platforms — stay consistent and engage your audience on autopilot.' },
  { icon: 'ads', title: 'Meta & Google Ads', desc: 'Run and optimise paid campaigns across Meta and Google Ads to reach the right audience, drive leads, and grow your business with measurable results.' },
  { icon: 'ai', title: 'AI Automation', desc: 'Replace repetitive tasks with intelligent AI workflows that save time, reduce errors, and scale your operations effortlessly.' },
  { icon: 'seo', title: 'SEO', desc: 'Rank higher on Google with proven on-page and off-page SEO strategies that bring consistent, organic traffic to your site.' }
]

const processSteps = [
  { num: '01', title: 'DISCOVERY', desc: 'Deep dive into your brand, audience, and goals. We align on vision before touching a single pixel.' },
  { num: '02', title: 'DESIGN', desc: 'High-fidelity mockups and interactive prototypes. Every element is meticulously crafted for visual impact.' },
  { num: '03', title: 'DEVELOP', desc: 'Production-grade code with modern frameworks. Performance-optimized, accessible, and rigorously tested.' },
  { num: '04', title: 'DELIVER', desc: 'Launch, iterate, and grow. Ongoing support, analytics review, and continuous optimization post-launch.' }
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

const faqs = [
  {
    q: 'How is MURBAN different from Wix, Squarespace, or DIY builders?',
    a: 'Wix and similar tools are something you operate yourself — you\'re still doing the design, updates, and tech work. MURBAN is a managed studio. A real designer shapes your brand, a real developer ships production-grade code, and our team runs and evolves your digital presence. You don\'t wrestle with a drag-and-drop builder. We handle it.'
  },
  {
    q: 'Why is your pricing so low? What\'s the catch?',
    a: 'There isn\'t one. We automate the grunt work agencies still do by hand — pulling your info, generating layout foundations, running baseline SEO — but a real designer and developer still review and ship every project. The price stays intentionally low because the workflow is streamlined, not because the craft is cut. No setup fees, no hidden costs, and no "introductory" rate that jumps on renewal. What we quote is what you pay.'
  },
  {
    q: 'Will my site look like everyone else\'s?',
    a: 'No. We start with your actual business — your photos, reviews, copy, and brand voice. Every MURBAN site is built around what makes you different. Two businesses in the same city will never get the same cookie-cutter layout.'
  },
  {
    q: 'Why should I choose MURBAN over another agency?',
    a: 'You get agency-level strategy, design, and development without bloated timelines or opaque billing. We\'re a full-stack digital partner — web, SEO, CRM, ads, and AI automation under one roof — with a proven four-step process and 98% client retention. You talk directly to the people building your site, not a ticket queue.'
  },
  {
    q: 'How fast can you make changes after launch?',
    a: 'Most routine updates are handled within 24 hours — often the same day. Reach us by email, text, or chat. No ticket system, no waiting on hold.'
  },
  {
    q: 'Do I pay before I approve the finished site?',
    a: 'Tell us what you want changed and we\'ll fix it before go-live — or after, as many times as needed. You don\'t start an ongoing plan until you\'ve approved what we built. If we can\'t get it right, you walk away with nothing owed.'
  },
  {
    q: 'Is SEO included, and when will I see results?',
    a: 'SEO is built in from day one — proper meta tags, schema markup, sitemap, and local signals. Most clients see movement within 60–90 days; competitive markets take longer. We manage your SEO monthly, not just at launch.'
  },
  {
    q: 'I don\'t have a website — or I\'m stuck with an old one. Can you still help?',
    a: 'This happens more than you\'d think. Share whatever you have — a Google Maps link, your old domain, your Instagram — and we\'ll rebuild from there. You don\'t need anything from your old site to start.'
  },
  {
    q: 'What\'s the difference between MBASIC, MPREMIUM, and MELITE?',
    plansLink: true,
    aBefore: 'MBASIC covers essential web development for businesses that need a strong online presence. MPREMIUM adds chatbot and AI automation — our most popular starting point. MELITE is the full suite with CRM for teams ready to capture and manage every lead. Most new clients start on MPREMIUM and expand as they grow. See our ',
    aAfter: ' for details — pricing is deliberately accessible because great digital work shouldn\'t be gatekept behind traditional agency retainers.'
  }
]

const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

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
    <section id="services" class="services-section">
      <div class="services-header reveal">
        <div class="section-label services-label">WHAT WE DO</div>
        <h2 class="services-title">SAVE TIME AND MONEY WITH ALL TOOLS IN ONE PLACE</h2>
        <p class="services-sub">
          Typical business owners deal with 20+ tools — spreadsheets, CRMs, calendars,
          payments, and more. Not anymore.
        </p>
      </div>

      <div class="services-grid">
        <ServiceCard
          v-for="(s, i) in services"
          :key="i"
          :icon="s.icon"
          :title="s.title"
          :description="s.desc"
          :class="'reveal reveal-delay-' + ((i % 3) + 1)"
        />
      </div>
    </section>

    <!-- Process Section -->
    <section id="process" class="process-section">
      <div class="process-inner">
        <div class="process-header reveal">
          <div class="section-label process-label">HOW WE WORK</div>
          <h2 class="process-title">OUR PROVEN PROCESS</h2>
          <p class="process-sub">
            From first conversation to launch — a clear, four-step path
            to a digital presence that performs.
          </p>
        </div>

        <div class="process-grid">
          <ProcessStepCard
            v-for="(step, i) in processSteps"
            :key="i"
            :num="step.num"
            :title="step.title"
            :description="step.desc"
            :class="'reveal reveal-delay-' + ((i % 4) + 1)"
          />
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials-section">
      <div class="testimonials-inner">
        <div class="testimonials-header reveal">
          <div class="section-label testimonials-label">CLIENT STORIES</div>
          <h2 class="testimonials-title">TRUSTED BY THE BEST</h2>
          <p class="testimonials-sub">
            Real results from businesses who partnered with MURBAN to grow online.
          </p>
        </div>

        <div class="testimonials-grid">
          <TestimonialCard
            v-for="(t, i) in testimonials"
            :key="i"
            :text="t.text"
            :name="t.name"
            :role="t.role"
            :initials="t.initials"
            :class="'reveal reveal-delay-' + ((i % 2) + 1)"
          />
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq">
      <div class="section-label reveal">FAQ</div>
      <h2 class="section-title reveal reveal-delay-1">
        QUESTIONS YOU'D ASK <span class="dim">A FRIEND</span>
      </h2>
      <p class="faq-sub reveal reveal-delay-2">
        The questions you'd ask a friend before signing up.
      </p>

      <div class="faq-list reveal">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="faq-item"
          :class="{ 'faq-open': openFaq === i }"
        >
          <button
            type="button"
            class="faq-question"
            :aria-expanded="openFaq === i"
            @click="toggleFaq(i)"
          >
            <span>{{ item.q }}</span>
            <span class="faq-icon" aria-hidden="true">{{ openFaq === i ? '−' : '+' }}</span>
          </button>
          <div class="faq-answer-wrap">
            <div class="faq-answer">
              <p v-if="item.plansLink">
                {{ item.aBefore }}<router-link to="/plans" class="faq-link">Plans page</router-link>{{ item.aAfter }}
              </p>
              <p v-else>{{ item.a }}</p>
            </div>
          </div>
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
            <input
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              v-model="contactHoneypot"
              class="cta-honeypot"
            />
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
