import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer'; // Используем ESM-импорт

export default defineConfig({
    // Базовые настройки
    base: process.env.APP_ENV === 'production' ? '/build/' : '',
    publicDir: false, // Отключаем стандартную public директорию
    
    plugins: [
        // Плагин для Laravel
        laravel({
            // Точки входа (только ваши файлы, без vendor)
            input: [
                'resources/css/app.css',
                'resources/js/app.js'
            ],
            
            // Настройки горячей перезагрузки
            refresh: {
                paths: [
                    'app/**',
                    'config/**',
                    'resources/views/**',
                    'routes/**'
                ],
                config: false // Не следим за изменениями в конфигах
            },
            
            // Игнорируем vendor и node_modules
            buildDirectory: 'build',
            scan: {
                paths: ['resources/'],
                exclude: [
                    'vendor/**',
                    'node_modules/**'
                ]
            }
        }),
        
        // Плагин для Vue
        vue({
            template: {
                transformAssetUrls: {
                    // Корректная обработка ассетов в шаблонах
                    base: null,
                    includeAbsolute: false,
                    tags: {
                        video: ['src', 'poster'],
                        source: ['src'],
                        img: ['src'],
                        image: ['xlink:href', 'href'],
                        use: ['xlink:href', 'href']
                    }
                }
            },
            reactivityTransform: false // Отключаем экспериментальные фичи
        })
    ],
    
    // Настройки сервера разработки
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true, // Не искать другие порты
        hmr: {
            host: 'localhost',
            protocol: 'ws'
        },
        watch: {
            ignored: [
                '**/vendor/**',
                '**/node_modules/**',
                '**/storage/**',
                '**/bootstrap/cache/**'
            ]
        }
    },
    
    // Настройки сборки
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            external: [
                'tippy.js', // Игнорируем проблемные модули
                /^@heroicons\/vue/,
                /^lodash\./
            ],
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'chunks/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js'
            }
        },
        chunkSizeWarningLimit: 1000 // Лимит предупреждений о размере
    },
    
    // Оптимизация разрешения модулей
    resolve: {
        alias: {
            '@': '/resources/js',
            '~': '/resources'
        },
        extensions: ['.js', '.vue', '.json']
    },
    
    // Настройки CSS
    css: {
        postcss: {
            plugins: [
                autoprefixer() // Используем импортированный autoprefixer
            ]
        },
        preprocessorOptions: {
            scss: {
                additionalData: `@import "resources/css/variables.scss";`
            }
        }
    }
});