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
    }
})