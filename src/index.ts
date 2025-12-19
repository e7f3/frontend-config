'use strict'

/**
 * Frontend configuration presets and builders for Webpack, Vite, Jest, ESLint, Stylelint, and Biome.
 */

// Webpack exports
export { buildWebpackConfig } from './webpack/builders/buildWebpackConfig'
export { reactPreset as webpackReactPreset } from './webpack/presets/reactPreset'
export { vanillaPreset as webpackVanillaPreset } from './webpack/presets/vanillaPreset'
export { typescriptPreset as webpackTypescriptPreset } from './webpack/presets/typescriptPreset'
export type { BuildOptions as WebpackBuildOptions, BuildPaths as WebpackBuildPaths, EnvVariables } from './webpack/types/config'

// Vite exports
export { buildViteConfig } from './vite/builders/buildViteConfig'
export { reactPreset as viteReactPreset } from './vite/presets/reactPreset'
export { vanillaPreset as viteVanillaPreset } from './vite/presets/vanillaPreset'
export { typescriptPreset as viteTypescriptPreset } from './vite/presets/typescriptPreset'
export type { ViteBuildOptions, ViteBuildPaths } from './vite/types/config'

// Jest exports
export { buildJestConfig } from './jest/buildJestConfig'
export { reactPreset as jestReactPreset } from './jest/presets/reactPreset'
export { typescriptPreset as jestTypescriptPreset } from './jest/presets/typescriptPreset'
export { basePreset as jestBasePreset } from './jest/presets/basePreset'
export type { JestConfig as JestBuildOptions } from './jest/types/config'

// ESLint exports
export { buildEslintConfig } from './eslint/buildEslintConfig'
export type { BuildConfigOptions as EslintBuildOptions } from './eslint/types/config'

// Stylelint exports
export { buildStylelintConfig } from './stylelint/buildStylelintConfig'
export type { BuildStylelintConfigOptions as StylelintBuildOptions } from './stylelint/types/config'

// Vitest exports
export { buildVitestConfig } from './vitest/buildVitestConfig'
export { reactPreset as vitestReactPreset } from './vitest/presets/reactPreset'
export { typescriptPreset as vitestTypescriptPreset } from './vitest/presets/typescriptPreset'
export { basePreset as vitestBasePreset } from './vitest/presets/basePreset'
export type { VitestConfig as VitestBuildOptions } from './vitest/types/config'

// Biome exports
export { buildBiomeConfig } from './biome/builders/buildBiomeConfig'
export { reactPreset as biomeReactPreset } from './biome/presets/reactPreset'
export { typescriptPreset as biomeTypescriptPreset } from './biome/presets/typescriptPreset'
export { basePreset as biomeBasePreset } from './biome/presets/basePreset'
export type { BuildBiomeConfigOptions as BiomeBuildOptions } from './biome/types/config'

// Shared types
export * from './shared/types'
