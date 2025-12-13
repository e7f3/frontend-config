import webpack from 'webpack'

import type { BuildOptions } from '../types/config'

/**
 * Progress plugin configuration for webpack.
 */

/**
 * Builds ProgressPlugin configuration for providing build progress feedback.
 * @param options - Build options containing environment configuration
 * @returns ProgressPlugin instance configured for the current environment
 */
export function buildProgressPlugin(options: BuildOptions): webpack.ProgressPlugin {
    return new webpack.ProgressPlugin({
        profile: options.isDev,
    })
}
