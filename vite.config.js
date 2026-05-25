import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

    plugins: [
        tailwindcss(),
    ],
    base: './', // atau '/' untuk root domain
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    },
    optimizeDeps: {
        include: ['@zxing/library']
    },
    server: {
        proxy: {
            '/google-script': {
                target: 'https://script.google.com/macros/s/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/google-script/, ''),
                secure: false,
                ws: true
            }
        }
    }
})