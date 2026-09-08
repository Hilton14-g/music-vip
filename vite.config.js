import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/ytm': {
        target: 'https://music.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ytm/, '/youtubei/v1'),
        headers: {
          'Origin': 'https://music.youtube.com',
          'Referer': 'https://music.youtube.com/'
        }
      }
    }
  }
});
