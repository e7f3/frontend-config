import type { ResolveOptions } from 'webpack'

import type { BuildOptions } from '../types/config'

/**
 * Webpack module resolution configuration builder.
 */

/**
 * Builds webpack module resolution configuration.
 * @param options - Build options containing path configuration
 * @returns Webpack ResolveOptions configuration for module resolution
 */
export function buildResolvers(options: BuildOptions): ResolveOptions {
    const { paths } = options

    return {
        modules: ['node_modules', paths.src],
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': paths.src,
        },
    }
}
