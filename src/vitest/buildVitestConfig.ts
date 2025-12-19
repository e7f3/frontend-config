import { basePreset } from './presets/basePreset'
import { reactPreset } from './presets/reactPreset'
import { typescriptPreset } from './presets/typescriptPreset'
import type { VitestConfig, VitestOptions } from './types/config'

/**
 * Builds Vitest configuration with preset support and sensible defaults.
 * @param options - Configuration options including preset selection
 * @returns Complete Vitest configuration object
 */
export function buildVitestConfig(options: VitestOptions = {}): VitestConfig {
    // Step 1: Get preset configuration based on preset selection
    let presetConfig: Partial<VitestConfig> = {}

    switch (options.preset) {
        case 'react':
            presetConfig = reactPreset()
            break
        case 'typescript':
            presetConfig = typescriptPreset()
            break
        case 'base':
        default:
            presetConfig = basePreset()
            break
    }

    // Step 2: Build final config with proper precedence:
    // User options > Preset defaults > Global defaults
    const config: VitestConfig = {
        // Start with preset config (medium priority)
        ...presetConfig,

        // Override with all user-provided options (highest priority)
        ...options,

        // Set global defaults only if not in preset or user options (lowest priority)
        test: {
            ...presetConfig.test,
            ...options.test,
            globals: options.test?.globals ?? presetConfig.test?.globals ?? true,
            environment: options.test?.environment ?? presetConfig.test?.environment ?? 'node',
            include: options.test?.include ?? presetConfig.test?.include ?? ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
            exclude: options.test?.exclude ?? presetConfig.test?.exclude ?? ['**/node_modules/**', '**/dist/**'],
        },
    }

    // Step 3: Clean up the configuration
    // Remove the 'preset' key from the options if it exists (it's not a valid Vitest option)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { preset, ...finalOptions } = options
    const finalConfig: VitestConfig = {
        ...config,
        ...finalOptions,
    }

    return finalConfig
}
