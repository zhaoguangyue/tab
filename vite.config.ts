import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: "static",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "./index.html"),
        newTab: resolve(__dirname, "./tab.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `$injectedColor: orange;`,
      },
    },
  },
});
