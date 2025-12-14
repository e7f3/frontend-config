import type { UserConfig } from '../types/config'
import type { ViteBuildOptions } from '../types/config'

/**
 * Vite configuration builder with advanced optimizations.
 */

/**
 * Creates a complete Vite configuration with advanced optimizations.
 * @param options - Configuration options for Vite build
 * @returns Complete Vite UserConfig object
 */
export function buildViteConfig(options: ViteBuildOptions): UserConfig {
    const isProd = options.mode === 'production'

    const config: UserConfig = {
        root: options.paths.src,
        base: options.publicPath ?? '/',
        plugins: [],
        resolve: {
            alias: {
                '@': options.paths.src,
            },
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        },
        css: {
            modules: {
                localsConvention: 'camelCase',
                generateScopedName: isProd ? '[hash:base64:8]' : '[name]__[local]__[hash:base64:5]',
            },
        },
        server: options.isDev
            ? {
                port: options.port ?? 3000,
                host: true,
                https: false,
                open: false,
            }
            : undefined,
        build: {
            outDir: options.paths.output,
            assetsDir: 'assets',
            minify: isProd ? 'esbuild' : false,
            sourcemap: !isProd,
            target: 'es2020',
            // Vite build optimizations
            rollupOptions: {
                input: {
                    main: options.paths.entry,
                },
                output: {
                    // Advanced code splitting strategies
                    manualChunks: (id: string) => {
                        // Vendor chunk optimization
                        if (id.includes('node_modules')) {
                            // Separate large vendor packages
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'react-vendor'
                            }
                            if (id.includes('vue')) {
                                return 'vue-vendor'
                            }
                            if (id.includes('@angular') || id.includes('@ng')) {
                                return 'angular-vendor'
                            }
                            if (id.includes('lodash') || id.includes('underscore')) {
                                return 'utils-vendor'
                            }
                            if (id.includes('date-fns') || id.includes('moment')) {
                                return 'date-vendor'
                            }
                            // Group other node_modules
                            return 'vendor'
                        }
                        
                        // Route-based chunking for SPA
                        if (id.includes('/pages/') || id.includes('/routes/')) {
                            return 'routes'
                        }
                        
                        // Component library chunking
                        if (id.includes('/components/ui/')) {
                            return 'ui-components'
                        }
                        
                        // Feature-based chunking
                        if (id.includes('/features/')) {
                            return 'features'
                        }
                        
                        // Utilities chunking
                        if (id.includes('/utils/') || id.includes('/helpers/')) {
                            return 'utils'
                        }
                        
                        return undefined
                    },
                },
            },
        },
        // Enhanced dependency pre-bundling
        optimizeDeps: {
            // Include additional dependencies for pre-bundling
            include: [
                // Core framework dependencies
                'react',
                'react-dom',
                'react-router-dom',
                'react-query',
                '@tanstack/react-query',
                'zustand',
                'immer',
                'lodash',
                'date-fns',
                'axios',
                // UI libraries
                '@headlessui/react',
                '@heroicons/react',
                'lucide-react',
            ],
            // Explicitly exclude problematic dependencies
            exclude: [
                '@vite/client',
                '@vite/env',
            ],
        },
    }

    return config
}
