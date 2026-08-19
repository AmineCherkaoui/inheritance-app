import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons.svg", "images/**/*", "fonts/**/*"],
      manifest: {
        name: "حساب الفرائض والمواريث",
        short_name: "المواريث",
        description:
          "تطبيق حساب الفرائض والمواريث الشرعية وتوزيع التركات بدقة وسهولة",
        background_color: "#881717",
        theme_color: "#881717",
        display: "standalone",
        orientation: "any",
        dir: "rtl",
        lang: "ar",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,ttf,otf,woff,woff2,json}",
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "image" || request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
