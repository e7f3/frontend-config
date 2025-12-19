'use strict'

import type { Linter } from 'eslint'

/**
 * Rule severity levels for ESLint rule configuration.
 */
export type RuleSeverity = 'off' | 'warn' | 'error'

/**
 * Configuration presets for different project maturity levels.
 */
export type ConfigurationPreset =
    | 'strict' // Maximum strictness for production code
    | 'standard' // Standard balanced configuration
    | 'relaxed' // More lenient rules for prototyping
    | 'minimal' // Minimal rules for legacy projects

/**
 * Rule category types for better organization and documentation.
 */
export type RuleCategory =
    | 'typescript'
    | 'react'
    | 'accessibility'
    | 'imports'
    | 'code-quality'
    | 'style'
    | 'performance'
    | 'security'
    | 'modern-js'

/**
 * Individual rule configuration with optional metadata.
 */
export interface RuleConfig {
    /** Rule severity level */
    severity: RuleSeverity
    /** Additional configuration options for the rule */
    options?: Record<string, any>
    /** Human-readable description of the rule */
    description?: string
    /** Rule category for organization */
    category?: RuleCategory
    /** Whether this rule is recommended by the plugin */
    recommended?: boolean
}

/**
 * Extended rule configuration with additional metadata for advanced use cases.
 */
export interface ExtendedRuleConfig extends RuleConfig {
    /** Whether this rule has been deprecated */
    deprecated?: boolean
    /** Alternative rule to use instead of deprecated rule */
    replacement?: string
    /** URL to official documentation for this rule */
    docsUrl?: string
}

/**
 * Main configuration options for ESLint configuration builder.
 */
export interface BuildConfigOptions {
    /** Enable i18next rules for internationalization support */
    enableI18next?: boolean

    /** Enable Storybook-specific rule overrides */
    enableStorybook?: boolean

    /** Enable Jest-specific rule overrides and global variables */
    enableJest?: boolean

    /** Custom rules to override or extend base configuration */
    customRules?: Linter.RulesRecord

    /** Additional file patterns to ignore during linting */
    ignorePatterns?: Array<string>

    /** Path to tsconfig.json for TypeScript type checking integration */
    tsconfigPath?: string

    /** Configuration preset for different project requirements */
    preset?: ConfigurationPreset

    /** Enable strict TypeScript rules for enhanced type safety */
    strictTypeScript?: boolean

    /** Enable modern JavaScript/TypeScript features rules */
    enableModernFeatures?: boolean

    /** Enable performance optimization rules */
    enablePerformanceRules?: boolean

    /** Enable security rules for better code security */
    enableSecurityRules?: boolean

    /** Enable accessibility rules for web accessibility compliance */
    enableAccessibilityRules?: boolean

    /** Maximum line length for code formatting rules */
    maxLineLength?: number

    /** Custom TypeScript parser options for advanced configuration */
    typescriptParserOptions?: Record<string, any>

    /** Custom global variables for the linting environment */
    customGlobals?: Record<string, 'readonly' | 'writable'>

    /** Environment-specific configurations for different execution contexts */
    environments?: {
        /** Enable Node.js environment globals and rules */
        node?: boolean
        /** Enable browser environment globals and rules */
        browser?: boolean
        /** Enable Jest testing environment configuration */
        jest?: boolean
        /** Enable Testing Library specific rules and utilities */
        testingLibrary?: boolean
    }
}

/**
 * Configuration result with comprehensive metadata.
 */
export interface BuildConfigResult {
    /** Generated ESLint flat configuration array */
    configs: Array<Linter.Config>
    /** Configuration metadata for analysis and debugging */
    metadata: {
        /** Total number of rules configured */
        rulesCount: number
        /** List of ESLint plugins included in the configuration */
        pluginsUsed: Array<string>
        /** Configuration presets that were applied */
        presetsEnabled: Array<ConfigurationPreset>
        /** Features that were enabled in this configuration */
        featuresEnabled: Array<string>
        /** Whether performance optimizations were applied */
        performanceOptimized: boolean
    }
}

/**
 * Rule metadata for comprehensive documentation and organization.
 */
export interface RuleMetadata {
    /** ESLint rule name */
    name: string
    /** Human-readable description of the rule's purpose */
    description: string
    /** Category this rule belongs to for organization */
    category: RuleCategory
    /** Default severity level for this rule */
    severity: RuleSeverity
    /** Additional configuration options for this rule */
    options?: Record<string, any>
    /** Whether this rule has been deprecated */
    deprecated?: boolean
    /** Alternative rule to use if this one is deprecated */
    replacement?: string
    /** URL to official documentation for this rule */
    docsUrl?: string
    /** Whether this rule is recommended by its plugin */
    recommended: boolean
}
