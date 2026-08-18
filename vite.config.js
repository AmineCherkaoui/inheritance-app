import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons.svg',
        'images/**/*',
        'fonts/**/*',
      ],
      manifest: {
        name: 'حساب الفرائض والمواريث',
        short_name: 'المواريث',
        description: 'تطبيق حساب الفرائض والمواريث الشرعية وتوزيع التركات بدقة وسهولة',
        background_color: '#fdf5eb',
        theme_color: '#450100',
        display: 'standalone',
        orientation: 'any',
        dir: 'rtl',
        lang: 'ar',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/images/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/images/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,otf,woff,woff2,json}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})

