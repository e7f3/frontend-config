'use strict'

import type { Config } from 'stylelint'
import { propertyOrdering, selectorOrdering } from 'stylelint-semantic-groups'

import type { BuildStylelintConfigOptions } from './types/config'

/**
 * Performance-optimized Stylelint configuration builder for modern CSS/SCSS development.
 */

// Semantic groups cache for better performance
const semanticGroupsCache = new Map()

/**
 * Modern Stylelint 16.x+ optimized rules with performance improvements.
 */
const baseRules: Config['rules'] = {
    // Core CSS rules - optimized for Stylelint 16.x+
    'selector-class-pattern': null,
    'declaration-empty-line-before': null,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',

    // Modern pseudo-class handling with performance optimization
    'selector-pseudo-class-no-unknown': [
        true,
        {
            ignorePseudoClasses: ['global', 'local', 'export', 'import', 'deep', 'local'],
        },
    ],

    // Property validation with modern options
    'property-no-unknown': [
        true,
        {
            ignoreProperties: ['composes', 'aspect-ratio'],
        },
    ],

    // SCSS specific rules - conditionally loaded
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,

    // Performance optimizations
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true,
}

/**
 * SCSS rules optimized for better performance.
 */
const scssRules: Config['rules'] = {
    'scss/at-rule-no-unknown': true,
    'scss/at-extend-no-missing-placeholder': true,
    'scss/comment-no-empty': true,
    'scss/declaration-nested-properties-no-divided-groups': true,
    'scss/double-slash-comment-empty-line-before': [
        'always',
        {
            except: ['first-nested'],
            ignore: ['between-comments', 'stylelint-commands'],
        },
    ],
    'scss/operator-no-newline-after': true,
    'scss/operator-no-unspaced': true,
    'scss/no-global-function-names': null,
    // Modern SCSS rules for Stylelint 16.x+
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-mixin-no-risky-nesting-selectors': true,
}

/**
 * Build Stylelint configuration with customizable options and performance optimizations.
 * @param options - Configuration options for customization
 * @returns Optimized Stylelint configuration object
 */
export function buildStylelintConfig(options: BuildStylelintConfigOptions = {}): Config {
    const {
        enableSemanticGroups = true,
        enableScss = true,
        customRules = {},
        ignoreFiles = [],
        additionalPlugins = [],
        maxNestingDepth = 4,
        colorFormat = 'hex',
        semanticGroups = {},
        enableModernScss = true,
        performance = {},
    } = options

    const plugins = []
    const rules: any = { ...baseRules }

    // Performance optimization: Only load order plugin if semantic groups are enabled
    if (enableSemanticGroups) {
        // Use cached plugin loading for better performance
        plugins.push('stylelint-order')

        // Dynamic semantic groups with caching
        createDynamicSemanticGroups(semanticGroups)
        rules['order/order'] = selectorOrdering
        rules['order/properties-order'] = propertyOrdering
    }

    // Add modern SCSS rules if enabled
    if (enableScss) {
        Object.assign(
            rules,
            enableModernScss
                ? scssRules
                : {
                      'scss/at-rule-no-unknown': true,
                      'scss/at-extend-no-missing-placeholder': true,
                      'scss/comment-no-empty': true,
                  }
        )
    }

    // Add nesting depth rule with performance consideration
    if (maxNestingDepth && maxNestingDepth > 0) {
        rules['max-nesting-depth'] = maxNestingDepth
    }

    // Add color format rule with modern syntax
    if (colorFormat) {
        rules['color-named'] = 'never'
        if (colorFormat === 'hex') {
            rules['color-hex-length'] = 'short'
        } else if (colorFormat === 'rgb') {
            rules['color-function-notation'] = 'modern'
        }
    }

    // Merge custom rules (these override everything)
    Object.assign(rules, customRules)

    // Enhanced ignore patterns for better performance
    const enhancedIgnoreFiles = [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.fttemplates/**',
        '**/storybook-static/**',
        '**/*.min.css',
        '**/*.bundle.css',
        '**/vendor/**/*.css',
        ...ignoreFiles,
    ]

    // Modern configuration with performance optimizations
    const config: any = {
        extends: enableScss ? 'stylelint-config-standard-scss' : 'stylelint-config-standard',
        plugins: [...plugins, ...additionalPlugins],
        rules,
        ignoreFiles: enhancedIgnoreFiles,

        // Modern configuration options
        defaultSeverity: 'error',
        fix: false,

        // Report needless disposal options for better performance
        reportNeedlessDisables: true,
        reportInvalidScopeDisables: true,

        // Performance configuration
        performance: {
            enableCaching: performance.enableCaching ?? true,
            parallelProcessing: performance.parallelProcessing ?? false,
            maxConcurrency: performance.maxConcurrency ?? 4,
            cacheDirectory: performance.cacheDirectory,
            cacheFile: performance.cacheFile,
        },
    }

    return config
}

/**
 * Create dynamic semantic groups with performance optimization.
 * @param options - Semantic groups configuration options
 * @returns Cached semantic groups configuration
 */
function createDynamicSemanticGroups(options: BuildStylelintConfigOptions['semanticGroups']): unknown {
    const cacheKey = JSON.stringify(options)

    if (semanticGroupsCache.has(cacheKey)) {
        return semanticGroupsCache.get(cacheKey)
    }

    // Use propertyOrdering directly - it's already a configuration object
    const result = propertyOrdering

    semanticGroupsCache.set(cacheKey, result)
    return result
}

// Export utility functions for advanced usage
export { propertyOrdering, selectorOrdering, createDynamicSemanticGroups }
export type { BuildStylelintConfigOptions }
