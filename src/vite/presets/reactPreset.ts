import type { UserConfig } from '../types/config'
import type { ViteBuildOptions } from '../types/config'

/**
 * React preset for Vite with Fast Refresh and JSX runtime optimization.
 */

/**
 * Creates a Vite configuration optimized for React applications.
 * @param options - Configuration options for React Vite build
 * @returns Complete Vite UserConfig object with React optimizations
 */
export function reactPreset(options: ViteBuildOptions): UserConfig {
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
                proxy: {
                    '/api': {
                        target: options.env?.apiUrl ?? 'http://localhost:8080',
                        changeOrigin: true,
                        rewrite: (path: string) => path.replace(/^\/api/, ''),
                    },
                },
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
            include: ['react', 'react-dom', 'react-router-dom'],
        },
    }

    // Add React plugin if reactOptions are provided
    if (options.reactOptions) {
        config.plugins?.push(
            // This would be the React plugin in a real implementation
            // For now, we'll simulate the structure
            {
                name: 'vite:react',
                config: () => ({
                    fastRefresh: options.reactOptions?.fastRefresh ?? true,
                    jsxRuntime: options.reactOptions?.jsxRuntime ?? 'automatic',
                }),
            },
        )
    }

    return config
}
