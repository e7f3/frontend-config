'use strict'

/**
 * Jest configuration system with SWC-Jest performance optimization.
 */

export { buildJestConfig } from './buildJestConfig'
export { basePreset } from './presets/basePreset'
export { reactPreset } from './presets/reactPreset'
export { typescriptPreset } from './presets/typescriptPreset'
export type { JestConfig, JestOptions, JestPreset } from './types/config'
