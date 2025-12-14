import type { UserConfig } from '../types/config'
import type { ViteBuildOptions } from '../types/config'

/**
 * Vanilla JavaScript/TypeScript preset for Vite with minimal configuration.
 */

/**
 * Creates a Vite configuration optimized for vanilla JavaScript/TypeScript projects.
 * @param options - Configuration options for vanilla Vite build
 * @returns Complete Vite UserConfig object with vanilla optimizations
 */
export function vanillaPreset(options: ViteBuildOptions): UserConfig {
    const isProd = options.mode === 'production'

    const config: UserConfig = {
        root: options.paths.src,
        base: options.publicPath ?? '/',
        plugins: [],
        resolve: {
            alias: {
                '@': options.paths.src,
            },
            extensions: ['.js', '.json'],
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
            target: 'modules',
            rollupOptions: {
                input: {
                    main: options.paths.entry,
                },
                output: {
                    manualChunks: (id: string) => {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                        return undefined
                    },
                },
            },
        },
        optimizeDeps: {
            include: [],
        },
    }

    return config
}
