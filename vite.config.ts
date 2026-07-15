import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/home-motion.tsx'),
      name: 'AlpeHomeMotion',
      formats: ['iife'],
      fileName: () => 'home-motion.js',
    },
    outDir: 'assets/js',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
