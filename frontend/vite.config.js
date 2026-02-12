import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/',   // 🔴 IMPORTANT
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
      output: {
        manualChunks: undefined,
      }
    }
  }
});
