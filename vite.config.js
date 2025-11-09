import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
      plugins: [react(), tailwindcss()],
      resolve: {
            alias: {
                  "@": path.resolve(__dirname, "./src"),
            },
      },
      build: {
            sourcemap: false,
            chunkSizeWarningLimit: 1000, // Increase limit to 1000KB (1MB)
            rollupOptions: {
                  output: {
                        manualChunks: {
                              // Split vendor chunks
                              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                              'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
                              'ui-vendor': ['lucide-react', '@radix-ui/react-label', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
                              'utils-vendor': ['axios', 'sonner', 'clsx', 'tailwind-merge', 'class-variance-authority'],
                        },
                  },
            },
      },
});