import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000'

  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: path.resolve('src/quasar-variables.sass')
      })
    ],
    server: {
      host: true,
      proxy: {
        // Proxy POST /feedback to backend when VITE_API_URL is not set
        '/feedback': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/feedback/, '/feedback')
        }
      }
    }
  }
})
