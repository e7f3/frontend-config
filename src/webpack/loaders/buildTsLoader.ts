import type { RuleSetRule } from 'webpack'

import { BuildOptions } from '../types/config'

/**
 * TypeScript loader configuration for webpack.
 */

/**
 * Builds TypeScript loader configuration.
 * @param options - Build options containing environment configuration
 * @returns RuleSetRule configuration for TypeScript processing
 */
export function buildTsLoader(options: BuildOptions): RuleSetRule {
    const { isDev } = options

    // Use fast esbuild-loader in development for speed
    if (isDev) {
        return {
            test: /\.tsx?$/,
            loader: 'esbuild-loader',
            exclude: /node_modules/,
            options: {
                loader: 'tsx',
                target: 'es2020',
            },
        }
    }

    // Use ts-loader in production for full type checking
    return {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }
}
