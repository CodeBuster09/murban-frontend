<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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

  const lerp = () => {
    ringX.value += (cursorX.value - ringX.value) * 0.15
    ringY.value += (cursorY.value - ringY.value) * 0.15
    ringRAF = requestAnimationFrame(lerp)
  }
  if (!ringRAF) lerp()
}

const onMouseOver = (e) => {
  if (e.target.closest('a, button, .btn-primary, .btn-ghost, .nav-links a, .router-link-active')) {
    cursorHover.value = true
  }
}
const onMouseOut = (e) => {
  if (e.target.closest('a, button, .btn-primary, .btn-ghost, .nav-links a, .router-link-active')) {
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

// ─── Lifecycle ───
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseover', onMouseOver)
  window.addEventListener('mouseout', onMouseOut)
  window.addEventListener('scroll', onScroll)
  onScroll()
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
      <router-link to="/" class="logo">MURBAN</router-link>

      <ul class="nav-links">
        <li><a href="/#services">Services</a></li>
        <li><a href="/#process">Process</a></li>
        <li><a href="/#testimonials">Testimonials</a></li>
        <li>
          <router-link to="/plans" class="nav-link" :class="{ active: route.name === 'plans' }">
            Plans
          </router-link>
        </li>
      </ul>

      <a href="/#contact" class="btn-primary gt-sm">START A PROJECT</a>

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
          <q-item clickable v-ripple href="/#services" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Services</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="/#process" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Process</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="/#testimonials" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1">Testimonials</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/plans" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1" :class="{ 'text-primary text-weight-bold': route.name === 'plans' }">Plans</q-item-section>
          </q-item>
          <q-item clickable v-ripple href="/#contact" @click="drawerOpen = false">
            <q-item-section class="text-subtitle1 text-primary text-weight-bold">Start a Project</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <router-view />

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

.nav-links .nav-link {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s;
  font-family: var(--font-body);
}

.nav-links .nav-link:hover,
.nav-links .nav-link.active {
  color: var(--white);
}
</style>
