import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    assetsDir: 'static',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, './popup.html'),
        newTab: resolve(__dirname, './tab.html'),
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
