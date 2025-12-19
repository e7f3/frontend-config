'use strict'

/**
 * @fileoverview Biome Configuration System
 *
 * Provides a modular system for configuring Biome linting and formatting.
 * Exports builders, presets, and types for creating Biome configurations.
 */

// Main configuration builder
export { buildBiomeConfig } from './builders/buildBiomeConfig'

// Preset configurations
export { basePreset } from './presets/basePreset'
export { reactPreset } from './presets/reactPreset'
export { typescriptPreset } from './presets/typescriptPreset'

// Type definitions
export type { BuildBiomeConfigOptions } from './types/config'
