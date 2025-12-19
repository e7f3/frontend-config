'use strict'

/**
 * Vitest configuration system with preset-based setup for React, TypeScript, and vanilla projects.
 */

export { buildVitestConfig } from './buildVitestConfig'
export { basePreset } from './presets/basePreset'
export { reactPreset } from './presets/reactPreset'
export { typescriptPreset } from './presets/typescriptPreset'
export type { VitestConfig, VitestOptions, VitestPreset } from './types/config'
