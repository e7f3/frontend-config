'use strict'

import { BuildBiomeConfigOptions } from '../types/config'

/**
 * React preset for Biome configuration with React-specific rules and best practices.
 * Enforces component patterns, JSX formatting, props management, and JSX structure.
 */
export const reactPreset: BuildBiomeConfigOptions = {
    enableReact: true,
    enableTypeScript: true,
    enableFormatting: true,
    enableLinting: true,
    ignorePatterns: [],
    tsconfigPath: './tsconfig.json',
    customRules: {
        'react/function-component-definition': [
            'error',
            {
                namedComponents: ['arrow-function', 'function-declaration'],
                unnamedComponents: ['arrow-function', 'function-expression'],
            },
        ],
        
        'jsx-quotes': ['error', 'prefer-single'],
        
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx', '.js'] }],
        
        'react/jsx-props-no-spreading': 'warn',
        
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    },
}