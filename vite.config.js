import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',  // 打包使用相对路径，解决 Netlify 部署时模块加载问题
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // RSS / Sitemap 由后端生成
      '/rss.xml': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
