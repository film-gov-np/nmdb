import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/*eslint no-undef: "error"*/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
