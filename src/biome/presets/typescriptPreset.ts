'use strict'

import { BuildBiomeConfigOptions } from '../types/config'

/**
 * TypeScript preset for Biome configuration with TypeScript-specific rules and best practices.
 * Enforces variable scoping, naming conventions, import/export patterns, and type safety.
 */
export const typescriptPreset: BuildBiomeConfigOptions = {
    enableReact: true,
    enableTypeScript: true,
    enableFormatting: true,
    enableLinting: true,
    ignorePatterns: [],
    tsconfigPath: './tsconfig.json',
    customRules: {
        '@typescript-eslint/no-shadow': 'warn',

        '@typescript-eslint/no-unused-vars': 'warn',

        '@typescript-eslint/no-use-before-define': ['error', { enums: false }],

        '@typescript-eslint/naming-convention': 'warn',

        '@typescript-eslint/no-var-requires': 'warn',

        '@typescript-eslint/ban-ts-comment': 'warn',
    },
}
