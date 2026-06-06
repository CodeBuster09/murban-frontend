import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: path.resolve('src/quasar-variables.sass')
    })
  ]
  ,
  server: {
    proxy: {
      // Proxy POST /feedback to backend to avoid CORS during local development
      '/feedback': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/feedback/, '/feedback')
      }
    }
  }
})
