import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

export default defineConfig({
  plugins: [react()],
  base: '/casteditor/',
  define: {
    global: 'globalThis',
    __APP_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: {
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'buffer': resolve(__dirname, 'node_modules/buffer/index.js'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
