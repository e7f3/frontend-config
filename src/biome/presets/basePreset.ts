'use strict'

import { BuildBiomeConfigOptions } from '../types/config'

/**
 * Base preset for Biome configuration with standard rules for JavaScript and TypeScript projects.
 * Enables React support, TypeScript support, formatting, and linting.
 */
export const basePreset: BuildBiomeConfigOptions = {
    enableReact: true,
    enableTypeScript: true,
    enableFormatting: true,
    enableLinting: true,
    ignorePatterns: [],
    tsconfigPath: './tsconfig.json',
}