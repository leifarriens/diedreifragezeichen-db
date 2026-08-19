import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, './tests/**'],
  },
  resolve: {
    alias: {
      '@/components': path.resolve(
        import.meta.dirname,
        './src/common/components',
      ),
      '@/hooks': path.resolve(import.meta.dirname, './src/common/hooks'),
      '@/layout': path.resolve(import.meta.dirname, './src/common/layout'),
      '@/utils': path.resolve(import.meta.dirname, './src/common/utils'),
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
