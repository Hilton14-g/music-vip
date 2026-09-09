import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import searchHandler from './api/ytm/search.js';

function localApiSearchPlugin() {
  return {
    name: 'local-api-search-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ytm/search', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 200;
          res.end();
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (e) {
            req.body = {};
          }

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          try {
            await searchHandler(req, res);
          } catch (err) {
            console.error('Error in local searchHandler:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiSearchPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
