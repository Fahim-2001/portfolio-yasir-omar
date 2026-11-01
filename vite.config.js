import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // The hero's 3D chunk (three + @react-three/fiber + drei, ~950 kB) is lazy-loaded
    // after the browser goes idle and never blocks first paint. three.js alone exceeds
    // the default 500 kB advisory limit, so it cannot be split below it.
    chunkSizeWarningLimit: 1000,
  },
});
