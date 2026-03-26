import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            buildDirectory: 'build',
            hotFile: 'hot',
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        outDir: 'build', // Força a saída para a pasta 'build' na raiz
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
