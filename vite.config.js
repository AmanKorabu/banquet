import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/banquetapi": {
        target: "https://xpresshotelpos.com", // 👈 your live domain
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
