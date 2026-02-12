import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        thankYou: resolve(__dirname, 'thank-you.html')
      },
      output: {
        manualChunks: undefined,
      }
    }
  }
});
