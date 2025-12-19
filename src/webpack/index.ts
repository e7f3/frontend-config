'use strict'

/**
 * Webpack configuration system with performance optimizations and modular builders.
 */

// Main configuration builder
export { buildWebpackConfig } from './builders/buildWebpackConfig'

// Preset configurations
export { reactPreset } from './presets/reactPreset'
export { vanillaPreset } from './presets/vanillaPreset'
export { typescriptPreset } from './presets/typescriptPreset'

// Type definitions
export type { BuildOptions, BuildPaths, EnvVariables } from './types/config'
export type { BuildPerformanceMetrics, BundleAnalysis, PerformanceHint, BuildHealthScore, PerformanceBudget } from './types/performance'
