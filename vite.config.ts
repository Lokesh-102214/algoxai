import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Vercel serves the custom domain from /, while GitHub Pages serves the
  // repository deployment from /algoxai/. The Pages workflow opts into the
  // project path explicitly; all other production hosts use the root path.
  base: process.env.VITE_DEPLOY_TARGET === "github-pages" ? "/algoxai/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
