import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, './tests/**'],
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './src/common/components'),
      '@/hooks': path.resolve(__dirname, './src/common/hooks'),
      '@/layout': path.resolve(__dirname, './src/common/layout'),
      '@/utils': path.resolve(__dirname, './src/common/utils'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
