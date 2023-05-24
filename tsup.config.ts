import { defineConfig } from 'tsup';

export const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  entry: { background: './src/background/index.js' },
  splitting: false,
  sourcemap: false,
  clean: false,
  platform: 'browser',
  format: ['esm'],
  target: 'esnext',
  minifyWhitespace: !isDev,
  minifySyntax: !isDev,
});
