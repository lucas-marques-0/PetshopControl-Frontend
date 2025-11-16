import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "e1800c2a-d1b7-41fc-ad0c-4b9905f207e1-00-2qf40b6f6hyqy.spock.replit.dev"
    ]
  }
})
