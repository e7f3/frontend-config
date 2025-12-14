import type { UserConfig } from '../types/config'
import type { ViteBuildOptions } from '../types/config'

/**
 * TypeScript preset for Vite with SWC integration for faster compilation.
 */

/**
 * Creates a Vite configuration optimized for TypeScript projects.
 * @param options - Configuration options for TypeScript Vite build
 * @returns Complete Vite UserConfig object with TypeScript optimizations
 */
export function typescriptPreset(options: ViteBuildOptions): UserConfig {
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
        esbuild: {
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
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
            include: ['react', 'react-dom'],
        },
    }

    return config
}
