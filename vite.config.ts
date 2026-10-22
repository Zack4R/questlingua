import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// The presentation must keep working if the venue Wi-Fi drops after the first load,
// so every built asset (JS, CSS, fonts, icons) is precached by a service worker.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'QuestLingua — Research Defense',
        short_name: 'QuestLingua',
        description:
          'Interactive research presentation: The Impact of Roblox-Based Game Activities on Students’ English Speaking Skills.',
        theme_color: '#070d22',
        background_color: '#070d22',
        display: 'fullscreen',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json,png,webp}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
