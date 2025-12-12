import TerserPlugin from 'terser-webpack-plugin'
import type { Configuration, Module } from 'webpack'

import type { BuildOptions } from '../types/config'

/**
 * Main optimization builder
 * Configures optimization settings for the webpack configuration
 */
export function buildOptimization(options: BuildOptions): Configuration['optimization'] {
    const { isDev } = options

    return {
        minimize: !isDev,
        minimizer: [
            // TerserPlugin for JavaScript minification
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: !isDev,
                    },
                    output: {
                        comments: false,
                    },
                },
                parallel: true,
            }),
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: (module: Module) => module.context?.includes('node_modules') ?? false,
                    name: 'vendors',
                    chunks: 'initial',
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: 'single',
        // Enable better tree shaking in production
        usedExports: !isDev,
        // Enable side effect analysis for better tree shaking
        sideEffects: !isDev,
    }
}
