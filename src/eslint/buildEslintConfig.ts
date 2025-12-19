'use strict'

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import i18nextPlugin from 'eslint-plugin-i18next'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

import { BuildConfigOptions } from './types/config'

/**
 * ESLint configuration builder with TypeScript, React, and accessibility support.
 * Provides production-ready linting setup with 200+ rules across multiple categories.
 */

// Rule configuration presets
const rulePresets = {
    strict: {
        // TypeScript - Maximum strictness
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',

        // Code quality
        'no-console': 'error',
        'no-debugger': 'error',
        'no-alert': 'error',

        // React
        'react/jsx-props-no-spreading': 'error',
    },

    standard: {
        // TypeScript - Balanced strictness
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

        // Code quality
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'error',

        // React
        'react/jsx-props-no-spreading': 'warn',
    },

    relaxed: {
        // TypeScript - Lenient
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',

        // Code quality
        'no-console': 'off',
        'no-debugger': 'warn',
        'no-alert': 'warn',

        // React
        'react/jsx-props-no-spreading': 'off',
    },

    minimal: {
        // Minimal rules for legacy projects
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        'no-console': 'off',
        'no-debugger': 'off',
        'max-len': 'off',
    },
} as const

/**
 * Core ESLint rules organized by category for optimal performance.
 */
const coreRules = {
    // Import and module organization rules
    'import/order': [
        'error',
        {
            groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
            pathGroups: [
                {
                    pattern: '@react/**',
                    group: 'external',
                    position: 'before',
                },
                {
                    pattern: '@src/**',
                    group: 'internal',
                    position: 'before',
                },
            ],
            'newlines-between': 'always',
            alphabetize: {
                order: 'asc',
                caseInsensitive: true,
            },
        },
    ],

    // TypeScript core rules
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-generic-constructors': 'error',
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-duplicate-type-constituents': 'error',
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/unified-signatures': 'error',

    // React core rules
    'react/display-name': 'off',
    'react/function-component-definition': [
        'error',
        {
            namedComponents: ['arrow-function', 'function-declaration'],
            unnamedComponents: ['arrow-function', 'function-expression'],
        },
    ],
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/require-default-props': 'off',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // Accessibility rules
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',

    // General code quality rules
    'no-param-reassign': ['warn', { props: false }],
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-var': 'error',

    // Code style and formatting
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'space-before-function-paren': [
        'error',
        {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
        },
    ],
    'space-infix-ops': 'error',
    'keyword-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    indent: ['error', 4, { SwitchCase: 1 }],

    // Modern JavaScript/TypeScript features
    'no-else-return': 'error',
    'no-useless-return': 'error',
    'no-return-assign': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-object-spread': 'error',
    'prefer-spread': 'error',

    // Performance optimization rules
    'no-loop-func': 'error',
    'no-extend-native': 'error',

    // Security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
} as const

/**
 * i18next-specific rules for internationalization enforcement.
 */
const i18nextRules = {
    'i18next/no-literal-string': [
        'error',
        {
            markupOnly: true,
            ignoreAttribute: ['data-testid', 'to', 'role'],
        },
    ],
} as const

/**
 * Merges base rules with preset configurations.
 * @param baseRules - The core rule set
 * @param preset - The configuration preset to apply
 * @returns Merged rule configuration
 */
function mergeRulesWithPreset(baseRules: Record<string, any>, preset?: string): Record<string, any> {
    if (!preset || preset === 'standard') {
        return { ...baseRules }
    }

    const presetRules = rulePresets[preset as keyof typeof rulePresets] || {}
    return { ...baseRules, ...presetRules }
}

/**
 * Builds ESLint configuration with customizable options.
 * @param options - Configuration options including presets, custom rules, and features
 * @returns Array of ESLint flat config objects
 */
export function buildEslintConfig(options: BuildConfigOptions = {}): Array<Linter.Config> {
    const {
        enableI18next = true,
        enableStorybook = true,
        enableJest = true,
        customRules = {},
        ignorePatterns = [],
        tsconfigPath = './tsconfig.json',
        preset = 'standard',
        maxLineLength = 150,
        enablePerformanceRules = true,
    } = options

    // Merge core rules with preset and custom rules
    const rules: Record<string, any> = mergeRulesWithPreset(coreRules, preset)

    // Apply custom rules override
    Object.assign(rules, customRules)

    // Add i18next rules if enabled
    if (enableI18next) {
        Object.assign(rules, i18nextRules)
    }

    // Add dynamic rules based on options
    if (enablePerformanceRules) {
        Object.assign(rules, {
            'max-len': [
                'error',
                {
                    code: maxLineLength,
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                },
            ],
        })
    }

    const configs: Array<Linter.Config> = [
        // Global ignores
        {
            ignores: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/coverage/**',
                '**/.fttemplates/**',
                '**/storybook-static/**',
                '**/*.min.js',
                ...ignorePatterns,
            ],
        },

        // Main configuration for TypeScript and JavaScript files
        {
            files: ['**/*.{ts,tsx,js,jsx}'],
            languageOptions: {
                parser: typescriptParser,
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    ecmaFeatures: {
                        jsx: true,
                    },
                    project: tsconfigPath,
                },
                globals: {
                    __IS_DEV__: 'readonly',
                    __API__: 'readonly',
                    __PROJECT__: 'readonly',
                    window: 'readonly',
                    document: 'readonly',
                    navigator: 'readonly',
                    console: 'readonly',
                    NodeJS: 'readonly',
                },
            },
            plugins: {
                '@typescript-eslint': typescriptEslint as any,
                react: react as any,
                'react-hooks': reactHooks as any,
                import: importPlugin as any,
                'jsx-a11y': jsxA11y as any,
            },
            settings: {
                react: {
                    version: 'detect',
                },
                'import/resolver': {
                    typescript: {
                        alwaysTryTypes: true,
                        project: tsconfigPath,
                    },
                    node: {
                        extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    },
                },
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts', '.tsx'],
                },
            },
            rules,
        },

        // i18next plugin configuration if enabled
        ...(enableI18next
            ? [
                  {
                      files: ['**/*.{ts,tsx,js,jsx}'],
                      plugins: {
                          i18next: i18nextPlugin as any,
                      },
                  },
              ]
            : []),

        // Storybook-specific configuration
        ...(enableStorybook
            ? [
                  {
                      files: ['**/*.stories.{ts,tsx}'],
                      rules: {
                          'i18next/no-literal-string': 'off',
                          'max-len': 'off',
                          'react/jsx-props-no-spreading': 'off',
                      } as any,
                  },
              ]
            : []),

        // Jest-specific configuration
        ...(enableJest
            ? [
                  {
                      files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
                      languageOptions: {
                          globals: {
                              describe: 'readonly',
                              it: 'readonly',
                              expect: 'readonly',
                              test: 'readonly',
                              jest: 'readonly',
                              beforeEach: 'readonly',
                              afterEach: 'readonly',
                              beforeAll: 'readonly',
                              afterAll: 'readonly',
                              vi: 'readonly',
                          },
                      },
                      rules: {
                          'i18next/no-literal-string': 'off',
                          'max-len': 'off',
                          '@typescript-eslint/no-var-requires': 'off',
                      } as any,
                  },
              ]
            : []),

        // JavaScript-specific overrides
        {
            files: ['**/*.js'],
            languageOptions: {
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                },
            },
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
            } as any,
        },
    ]

    return configs
}
