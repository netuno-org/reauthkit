import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true
  },
  plugins: [
    react()
  ],
  build: {
    onwarn: (warning, warn) => {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'EVAL') {
        return
      }
      warn(warning);
    }
  }
})
