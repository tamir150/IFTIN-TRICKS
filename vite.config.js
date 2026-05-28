import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'hero.png', 'exams/*.json'],
      manifest: {
        name: 'IFTIN TRICKS - Exam Portal',
        short_name: 'IftinTricks',
        description: 'National Exam Preparation Portal for Somali Students',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        categories: ['education', 'exams', 'learning']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/exams/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'exam-data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.includes('firebasestorage.googleapis.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-images',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ],
})
