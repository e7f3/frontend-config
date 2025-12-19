'use strict'

/**
 * Options for building Biome configuration.
 * Defines configuration options for customizing Biome's behavior.
 */
export interface BuildBiomeConfigOptions {
    /** Enable React-specific rules and plugins */
    enableReact?: boolean

    /** Enable TypeScript-specific rules and plugins */
    enableTypeScript?: boolean

    /** Custom rules to override or extend base configuration */
    customRules?: Record<string, any>

    /** Additional patterns to ignore during linting and formatting */
    ignorePatterns?: Array<string>

    /** Enable formatting rules and formatter */
    enableFormatting?: boolean

    /** Enable linting rules and linter */
    enableLinting?: boolean

    /** Path to TypeScript configuration file */
    tsconfigPath?: string
}
