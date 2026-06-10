import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlansView from '../views/PlansView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/plans', name: 'plans', component: PlansView }
  ],
  scrollBehavior(to, from, savedPosition) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const behavior = isMobile ? 'auto' : 'smooth'

    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior }
    return { top: 0, behavior }
  }
})

export default router
