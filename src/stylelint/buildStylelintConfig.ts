'use strict'

import type { Config } from 'stylelint'
import { propertyOrdering, selectorOrdering } from 'stylelint-semantic-groups'

import { BuildStylelintConfigOptions } from './types/config'

const baseRules: Config['rules'] = {
    'selector-class-pattern': null,
    'declaration-empty-line-before': null,
    'scss/at-import-partial-extension': null,
    'scss/dollar-variable-empty-line-before': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'selector-pseudo-class-no-unknown': [
        true,
        {
            ignorePseudoClasses: ['global', 'local', 'export', 'import'],
        },
    ],
    'property-no-unknown': [
        true,
        {
            ignoreProperties: ['composes'],
        },
    ],
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
}

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
}

/**
 * Build Stylelint configuration with customizable options
 *
 * @example
 * ```
 * // Basic usage - disable semantic groups
 * export default buildStylelintConfig({ enableSemanticGroups: false })
 *
 * // Custom rules and nesting depth
 * export default buildStylelintConfig({
 *   maxNestingDepth: 3,
 *   customRules: {
 *     'color-hex-length': 'short',
 *     'declaration-block-no-redundant-longhand-properties': true
 *   }
 * })
 *
 * // Disable SCSS, use plain CSS
 * export default buildStylelintConfig({
 *   enableScss: false,
 *   colorFormat: 'rgb'
 * })
 *
 * // Custom property ordering
 * export default buildStylelintConfig({
 *   customPropertyOrdering: propertyOrderFactory({
 *     // Custom semantic groups configuration
 *   })
 * })
 * ```
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
    } = options

    const plugins: string[] = []
    const rules: Config['rules'] = { ...baseRules }

    // Add order plugin if semantic groups are enabled
    if (enableSemanticGroups) {
        plugins.push('stylelint-order')
        rules['order/order'] = selectorOrdering
        rules['order/properties-order'] = propertyOrdering
    }

    // Add SCSS rules if enabled
    if (enableScss) {
        Object.assign(rules, scssRules)
    }

    // Add nesting depth rule
    if (maxNestingDepth) {
        rules['max-nesting-depth'] = maxNestingDepth
    }

    // Add color format rule
    if (colorFormat) {
        rules['color-named'] = 'never'
        if (colorFormat === 'hex') {
            rules['color-hex-length'] = 'short'
        }
    }

    // Merge custom rules (these override everything)
    Object.assign(rules, customRules)

    const config: Config = {
        extends: enableScss ? 'stylelint-config-standard-scss' : 'stylelint-config-standard',
        plugins: [...plugins, ...additionalPlugins],
        rules,
        ignoreFiles: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.fttemplates/**',
            '**/storybook-static/**',
            '**/*.min.css',
            ...ignoreFiles,
        ],
    }

    return config
}
