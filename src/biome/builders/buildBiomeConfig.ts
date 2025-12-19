'use strict'

import { BuildBiomeConfigOptions } from '../types/config'

/**
 * Builds a comprehensive Biome configuration object with customizable options.
 * @param options - Configuration options for customizing the Biome setup
 * @returns A complete Biome configuration object
 */
export function buildBiomeConfig(options: BuildBiomeConfigOptions = {}): Record<string, any> {
    const {
        enableReact = true,
        enableTypeScript = true,
        customRules = {},
        ignorePatterns = [],
        enableFormatting = true,
        enableLinting = true,
    } = options

    const baseConfig: Record<string, any> = {
        $schema: 'https://biomejs.dev/schemas/1.7.3/schema.json',

        files: {
            ignore: [
                '**/node_modules/**', // Node.js dependencies
                '**/dist/**', // Distribution builds
                '**/build/**', // Build outputs
                '**/coverage/**', // Test coverage reports
                '**/.fttemplates/**', // FT template files
                '**/storybook-static/**', // Storybook static files
                '**/*.min.js', // Minified JavaScript
                ...ignorePatterns, // User-defined patterns
            ],
        },

        formatter: enableFormatting
            ? {
                  enabled: true,
                  indentStyle: 'space',
                  indentSize: 2,
                  lineWidth: 140,
                  lineEnding: 'lf',
              }
            : { enabled: false },

        linter: enableLinting
            ? {
                  enabled: true,
                  rules: {
                      recommended: true,
                      ...(enableReact ? { react: true } : {}),
                      ...(enableTypeScript ? { typescript: true } : {}),
                  },
              }
            : { enabled: false },

        organizer: {
            enabled: true,
        },

        javascript: {
            formatter: {
                indentStyle: 'space',
                indentSize: 2,
                lineWidth: 140,
                lineEnding: 'lf',
            },
        },

        typescript: {
            formatter: {
                indentStyle: 'space',
                indentSize: 2,
                lineWidth: 140,
                lineEnding: 'lf',
            },
        },
    }

    if (Object.keys(customRules).length > 0) {
        if (!baseConfig.linter) {
            baseConfig['linter'] = { enabled: true, rules: {} }
        }
        baseConfig['linter'].rules = { ...baseConfig['linter'].rules, ...customRules }
    }

    return baseConfig
}
