import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    threads: true,
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
