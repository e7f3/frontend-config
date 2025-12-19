import TerserPlugin from 'terser-webpack-plugin'
import type { Configuration, Module } from 'webpack'

import type { BuildOptions } from '../types/config'

/**
 * Webpack optimization configuration builder.
 */

/**
 * Builds webpack optimization configuration.
 * @param options - Build options containing environment and optimization settings
 * @returns Webpack optimization configuration with advanced performance features
 */
export function buildOptimization(options: BuildOptions): Configuration['optimization'] {
    const { isDev } = options

    return {
        minimize: !isDev,
        minimizer: [
            // Enhanced TerserPlugin for JavaScript minification
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: !isDev,
                        drop_debugger: !isDev,
                        pure_funcs: !isDev ? ['console.log', 'console.info'] : [],
                        // Advanced compression options
                        dead_code: true,
                        keep_infinity: true,
                        // Optimize expressions
                        booleans_as_integers: true,
                    },
                    output: {
                        comments: false,
                        // Modern formatting options
                        ascii_only: false,
                        beautify: false,
                        // Optimize for modern browsers
                        safari10: true,
                    },
                    mangle: {
                        // Safari 10+ support
                        safari10: true,
                    },
                },
                parallel: true,
                extractComments: false,
            }),
        ],
        // Advanced split chunks configuration
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minRemainingSize: 0,
            maxInitialRequests: 30,
            maxAsyncRequests: 30,
            // Modern caching groups
            cacheGroups: {
                // React ecosystem optimization
                react: {
                    test: (module: Module) => {
                        const moduleContext = module.context || ''
                        return (
                            moduleContext.includes('node_modules') &&
                            (moduleContext.includes('react') ||
                                moduleContext.includes('react-dom') ||
                                moduleContext.includes('react-router'))
                        )
                    },
                    name: 'react',
                    priority: 40,
                    enforce: true,
                },
                // Vendor library optimization
                vendors: {
                    test: (module: Module) => module.context?.includes('node_modules') ?? false,
                    name: 'vendors',
                    chunks: 'initial',
                    priority: 30,
                    reuseExistingChunk: true,
                },
                // Common chunks for shared dependencies
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: 20,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                    enforce: true,
                },
                // Large utility libraries
                utilities: {
                    test: (module: Module) => {
                        const moduleContext = module.context || ''
                        return (
                            moduleContext.includes('node_modules') &&
                            (moduleContext.includes('lodash') ||
                                moduleContext.includes('underscore') ||
                                moduleContext.includes('date-fns') ||
                                moduleContext.includes('moment'))
                        )
                    },
                    name: 'utilities',
                    priority: 25,
                    chunks: 'all',
                    enforce: true,
                },
                // CSS chunks
                styles: {
                    name: 'styles',
                    test: /\.(css|scss|sass|less|styl)$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 15,
                },
                // Async chunks for dynamic imports
                async: {
                    name: 'async',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        },
        // Modern runtime chunk configuration
        runtimeChunk: {
            name: 'runtime',
        },
        // Enhanced tree shaking options
        usedExports: !isDev,
        sideEffects: !isDev,
        // Module concatenation for better tree shaking
        concatenateModules: !isDev,
        // Flag enabled modules for optimization
        providedExports: true,
        // Real content hash for better caching
        realContentHash: !isDev,
        // Module IDs
        moduleIds: !isDev ? 'deterministic' : 'named',
        // Chunk IDs
        chunkIds: !isDev ? 'deterministic' : 'named',
    }
}

/**
 * Builds persistent cache configuration for Webpack 5.
 * @param options - Build options containing environment configuration
 * @returns Webpack cache configuration
 */
export function buildPersistentCache(options: BuildOptions): Configuration['cache'] {
    const { isDev } = options

    if (!isDev) {
        // Production builds don't use persistent cache
        return undefined
    }

    return {
        type: 'filesystem' as const,
        // Cache version for invalidation
        version: '1.0.0',
        // Cache directory
        cacheDirectory: '.webpack-cache',
        // Build dependencies for cache invalidation
        buildDependencies: {
            default: [__filename, require.resolve('../buildWebpackConfig')],
            // Include all webpack builders
            webpack: [
                require.resolve('../builders/buildLoaders'),
                require.resolve('../builders/buildPlugins'),
                require.resolve('../builders/buildResolvers'),
            ],
        },
        // Managed paths that shouldn't trigger cache invalidation
        managedPaths: ['node_modules'],
        // Immutable paths that never change
        immutablePaths: ['node_modules/react', 'node_modules/react-dom'],
        // Cache compression
        compression: 'gzip' as const,
    }
}
