import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // GitHub Pages serves index.html with max-age=600, so a visitor can hold
        // a 10-minute-old shell while a deploy replaces the site underneath them.
        // If the entry filenames were hashed, that stale shell would request a
        // bundle the new deploy had already deleted and render a blank page.
        // Keeping the two files index.html names stable makes a stale shell still
        // bootable. Everything referenced from inside the bundle stays hashed,
        // since those names always arrive with the bundle that points at them.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (info) => {
          const source = info.names?.[0] ?? ''
          return source.endsWith('.css')
            ? 'assets/[name][extname]'
            : 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
