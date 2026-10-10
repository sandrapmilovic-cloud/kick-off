import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const configuredBasePath = process.env.VITE_BASE_PATH?.trim() || '/'
const basePath = configuredBasePath.endsWith('/') ? configuredBasePath : `${configuredBasePath}/`

export default defineConfig({
  base: basePath,
  server: {
    proxy: {
      '/api': process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8787',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
      manifest: {
        name: 'Kickoff - nogometne prognoze',
        short_name: 'Kickoff',
        description: 'Raspored utakmica i dostupne Bet365 nogometne kvote.',
        theme_color: '#17372c',
        background_color: '#f3f4ed',
        display: 'standalone',
        lang: 'hr',
        orientation: 'portrait',
        scope: basePath,
        start_url: basePath,
        icons: [
          { src: `${basePath}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${basePath}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${basePath}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
    }),
  ],
})
