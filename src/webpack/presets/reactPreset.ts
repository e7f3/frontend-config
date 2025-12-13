import type { Configuration } from 'webpack'

import { buildWebpackConfig } from '../builders/buildWebpackConfig'
import type { BuildOptions } from '../types/config'

/**
 * React webpack preset.
 */

/**
 * React preset builder.
 * @param options - Build options including paths, mode, and React-specific settings
 * @returns Webpack configuration optimized for React development and production
 */
export function reactPreset(options: BuildOptions): Configuration {
    return buildWebpackConfig({
        ...options,
        mode: options.mode || 'development',
        // React-specific configuration is handled by the loaders and plugins
    })
}
