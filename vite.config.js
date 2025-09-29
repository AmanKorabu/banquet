import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true, // Enables HTTPS for the Vite dev server
    proxy: {
      '/banquetapi': {
        target: 'https://xpresshotelpos.com/banquetapi',  // Your provided backend API base URL
        changeOrigin: true,  // Ensures the origin is rewritten correctly
        secure: true,  // Set to `true` to use SSL for the proxy
        rewrite: (path) => path.replace(/^\/banquetapi/, ''),  // Strips `/banquetapi` prefix when forwarding the request
      },
    },
  },
});
