import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/gymapp/", // ¡clave para GitHub Pages!
  plugins: [react()],
});
