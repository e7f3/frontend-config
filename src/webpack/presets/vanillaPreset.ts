import type { Configuration } from 'webpack'

import { buildWebpackConfig } from '../builders/buildWebpackConfig'
import type { BuildOptions } from '../types/config'

/**
 * Vanilla preset
 * Opinionated webpack configuration for vanilla JavaScript projects
 */
export function vanillaPreset(options: BuildOptions): Configuration {
    return buildWebpackConfig({
        ...options,
        mode: options.mode || 'development',
        // Vanilla JS preset - uses basic Babel transpilation without React/TypeScript presets
    })
}
