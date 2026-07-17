import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Nombre del repo en GitHub: la app se sirve desde https://<org>.github.io/<repo>/
const REPO_NAME = 'dfsush-ecommerce';

// Fallback SPA para GitHub Pages: Pages sirve 404.html ante cualquier ruta
// desconocida, y ese archivo es la propia SPA, que resuelve la ruta client-side.
function spaFallback(): Plugin {
  return {
    name: 'spa-github-pages-fallback',
    closeBundle() {
      copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${REPO_NAME}/` : '/',
  plugins: [react(), spaFallback()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
