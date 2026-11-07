import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset paths, so the build works at /qa-automation-resources/ on
  // GitHub Pages and at the root of a custom domain alike.
  base: './',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'build' },
});
