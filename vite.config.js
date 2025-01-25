import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import path from "path";

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Map "@" to the "src" directory
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dokaan-backend.vercel.app", // Your backend URL
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS with a valid certificate
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove `/api` prefix when forwarding requests
      },
    },
  },
});
