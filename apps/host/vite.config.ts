import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const isProd = false;
export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        web: isProd
          ? 'https://fcj001.github.io/FLOW-ISSUE-SYSTEM/assets/remoteEntry.js'
          : 'http://localhost:5174/FLOW-ISSUE-SYSTEM/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  base: '/FLOW-ISSUE-SYSTEM/',
  server: {
    port: 5173,
    fs: {
      strict: false, // ✅ 允许访问本地/父目录的 MF 子应用
    },
  },
});
