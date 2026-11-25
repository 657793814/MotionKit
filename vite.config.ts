import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import localConfigStore from './server/local-store.mjs'

export default defineConfig({
  plugins: [react(), localConfigStore()],
  server: {
    port: 5178,
    host: true,
  },
})
