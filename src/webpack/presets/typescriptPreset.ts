import type { Configuration } from 'webpack'

import { buildWebpackConfig } from '../builders/buildWebpackConfig'
import type { BuildOptions } from '../types/config'

/**
 * TypeScript webpack preset.
 */

/**
 * TypeScript preset builder.
 * @param options - Build options including paths, mode, and TypeScript-specific settings
 * @returns Webpack configuration optimized for TypeScript development and production
 */
export function typescriptPreset(options: BuildOptions): Configuration {
    return buildWebpackConfig({
        ...options,
        mode: options.mode || 'development',
        // TypeScript-specific configuration is handled by the TypeScript loader
        // in the buildLoaders function
    })
}
