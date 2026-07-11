import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the build work at any URL (user page, project page, custom domain)
export default defineConfig({
  base: './',
  plugins: [react()],
});
