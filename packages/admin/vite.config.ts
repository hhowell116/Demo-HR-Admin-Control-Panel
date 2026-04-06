import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/Live-HR-Admin-Control-Panel/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@rco/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
});
