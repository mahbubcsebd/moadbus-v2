import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'splash.html', dest: '.' },
        { src: 'base_props.prop', dest: '.' },
      ],
    }),
  ],
  base: './', // for Cordova (file://)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://core1.moadbusglobal.com/aimbdev',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'www',
    assetsDir: 'src',
    target: 'es2018',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: `src/[name].js`,
        chunkFileNames: `src/[name].js`,
        assetFileNames: `src/[name].[ext]`,
      },
    },
  },
});
