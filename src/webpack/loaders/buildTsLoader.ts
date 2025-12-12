import type { RuleSetRule } from 'webpack'

import { BuildOptions } from '../types/config'

/**
 * Builds TypeScript loader configuration
 * Uses esbuild-loader in dev for speed, ts-loader in prod for type safety
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
