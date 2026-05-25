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
            '/api': {
                target: 'https://script.google.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Tambahkan header jika diperlukan
                        proxyReq.setHeader('Origin', 'http://localhost:3000');
                    });
                }
            }
        }
    }
})