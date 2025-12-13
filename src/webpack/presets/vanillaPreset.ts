import type { Configuration } from 'webpack'

import { buildWebpackConfig } from '../builders/buildWebpackConfig'
import type { BuildOptions } from '../types/config'

/**
 * Vanilla JavaScript webpack preset.
 */

/**
 * Vanilla JavaScript preset builder.
 * @param options - Build options including paths, mode, and vanilla JavaScript settings
 * @returns Webpack configuration optimized for vanilla JavaScript development and production
 */
export function vanillaPreset(options: BuildOptions): Configuration {
    return buildWebpackConfig({
        ...options,
        mode: options.mode || 'development',
        // Vanilla JS preset - uses basic Babel transpilation without React/TypeScript presets
    })
}
