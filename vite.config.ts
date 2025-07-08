import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Astral PDF',
        short_name: 'AstralPDF',
        description: 'The ultimate client-side PDF toolkit',
        theme_color: '#a78bfa',
        background_color: '#a78bfa',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'logo-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'apple-touch.png', sizes: '180x180', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}); 