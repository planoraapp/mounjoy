import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        // The shared backend layer (userService.js, AuthContext.jsx) imports
        // '../supabaseClient', which needs to resolve differently per
        // bundler: Metro (native/expo-web) uses supabaseClient.js directly,
        // but Vite needs the import.meta.env-based variant instead — see
        // src/supabaseClient.vite.js for why.
        '../supabaseClient': fileURLToPath(new URL('./src/supabaseClient.vite.js', import.meta.url)),
      },
    },
  }
})
