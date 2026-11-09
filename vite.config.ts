import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Pages live at real paths (/resources/templates/, /notes/<slug>/), so assets
  // need absolute URLs. The site is served at the root of mohsintl.is-a.dev.
  base: '/',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'build' },
});
