<script setup>
import { h } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const svgAttrs = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg'
}

const stroke = {
  stroke: 'currentColor',
  'stroke-width': '1.6',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}

const iconMap = {
  strategy: () => h('svg', svgAttrs, [
    h('circle', { cx: 12, cy: 12, r: 8, ...stroke }),
    h('circle', { cx: 12, cy: 12, r: 3, ...stroke }),
    h('path', { d: 'M12 2v3M12 19v3M2 12h3M19 12h3', ...stroke })
  ]),
  web: () => h('svg', svgAttrs, [
    h('rect', { x: 3, y: 4, width: 18, height: 13, rx: 2, ...stroke }),
    h('path', { d: 'M3 9h18M8 20h8', ...stroke })
  ]),
  crm: () => h('svg', svgAttrs, [
    h('path', { d: 'M17 19a4 4 0 1 0-8 0', ...stroke }),
    h('circle', { cx: 13, cy: 8, r: 3, ...stroke }),
    h('path', { d: 'M7 19a4 4 0 0 1 8 0', ...stroke }),
    h('circle', { cx: 9, cy: 10, r: 2.5, ...stroke })
  ]),
  leads: () => h('svg', svgAttrs, [
    h('path', { d: 'M4 18V6l8-3 8 3v12', ...stroke }),
    h('path', { d: 'M12 9v9M8 12.5l4 2.5 4-2.5', ...stroke })
  ]),
  local: () => h('svg', svgAttrs, [
    h('path', { d: 'M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z', ...stroke }),
    h('circle', { cx: 12, cy: 11, r: 2, ...stroke })
  ]),
  social: () => h('svg', svgAttrs, [
    h('path', { d: 'M21 12a8 8 0 0 1-8 8', ...stroke }),
    h('path', { d: 'M3 12a8 8 0 0 1 8-8', ...stroke }),
    h('path', { d: 'M8 12h8M12 8v8', ...stroke })
  ]),
  ads: () => h('svg', svgAttrs, [
    h('path', { d: 'M4 10v4a2 2 0 0 0 2 2h2l4 4V4L8 8H6a2 2 0 0 0-2 2z', ...stroke }),
    h('path', { d: 'M16 8.5a4 4 0 0 1 0 7', ...stroke })
  ]),
  ai: () => h('svg', svgAttrs, [
    h('rect', { x: 5, y: 8, width: 14, height: 10, rx: 2, ...stroke }),
    h('path', { d: 'M9 8V6a3 3 0 0 1 6 0v2', ...stroke }),
    h('circle', { cx: 9.5, cy: 13, r: 1, fill: 'currentColor', stroke: 'none' }),
    h('circle', { cx: 14.5, cy: 13, r: 1, fill: 'currentColor', stroke: 'none' }),
    h('path', { d: 'M10 16h4', ...stroke })
  ]),
  seo: () => h('svg', svgAttrs, [
    h('circle', { cx: 11, cy: 11, r: 6, ...stroke }),
    h('path', { d: 'M16 16l4 4', ...stroke })
  ])
}
</script>

<template>
  <div class="service-card">
    <div class="service-icon-badge" aria-hidden="true">
      <component :is="iconMap[icon]" />
    </div>
    <h3 class="service-title">{{ title }}</h3>
    <p class="service-desc">{{ description }}</p>
  </div>
</template>
