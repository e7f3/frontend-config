"use strict";

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import type { Linter } from 'eslint'
import { BuildConfigOptions } from './types/config';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const baseRules: Linter.RulesRecord = {
  'import/order': [
    'error',
    {
      groups: [
        ['external', 'builtin'],
        'internal',
        ['sibling', 'parent'],
        'index',
      ],
      pathGroups: [
        {
          pattern: '@react',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@src/**',
          group: 'internal',
        },
      ],
      pathGroupsExcludedImportTypes: ['internal', 'react'],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  semi: 'off',
  'react/function-component-definition': [
    'error',
    {
      namedComponents: ['arrow-function', 'function-declaration'],
      unnamedComponents: ['arrow-function', 'function-expression'],
    },
  ],
  'jsx-quotes': ['error', 'prefer-single'],
  'react/jsx-filename-extension': [
    'error',
    { extensions: ['.tsx', '.jsx', '.js'] },
  ],
  'import/no-unresolved': 'off',
  'react/require-default-props': 'off',
  'import/no-extraneous-dependencies': 'off',
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': 'warn',
  'import/extensions': 'off',
  'import/prefer-default-export': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  'react/jsx-props-no-spreading': 'warn',
  'no-underscore-dangle': 'off',
  'import/no-import-module-exports': 'off',
  'max-len': [
    'error',
    {
      ignoreComments: true,
      ignoreUrls: true,
      code: 140,
      ignorePattern: '^(import\\s.+\\sfrom\\s.+|\\} from)',
    },
  ],
  '@typescript-eslint/no-var-requires': 'warn',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { enums: false }],
  '@typescript-eslint/naming-convention': 'warn',
  'react/display-name': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'error',
  'jsx-a11y/click-events-have-key-events': 'warn',
  'jsx-a11y/no-static-element-interactions': 'warn',
  'no-param-reassign': ['warn', { props: false }],
  '@typescript-eslint/ban-ts-comment': 'warn',
  'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
}

const i18nextRules: Linter.RulesRecord = {
  'i18next/no-literal-string': [
    'error',
    {
      markupOnly: true,
      ignoreAttribute: ['data-testid', 'to', 'role'],
    },
  ],
}

/**
 * Build ESLint configuration with customizable options
 * 
 * @example
 * ```
 * // Disable i18next rules
 * export default buildEslintConfig({ enableI18next: false })
 * 
 * // Add custom rules
 * export default buildEslintConfig({
 *   customRules: {
 *     'no-console': 'error',
 *     'max-len': ['error', { code: 120 }]
 *   }
 * })
 * ```
 */
export function buildEslintConfig(
  options: BuildConfigOptions = {}
): Linter.Config[] {
  const {
    enableI18next = true,
    enableStorybook = true,
    enableJest = true,
    customRules = {},
    ignorePatterns = [],
    tsconfigPath = './tsconfig.json',
  } = options

  const rules: Linter.RulesRecord = {
    ...baseRules,
    ...(enableI18next ? i18nextRules : {}),
    ...customRules,
  }

const configs: Linter.Config[] = [
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
  ]

  // Add i18next plugin if enabled
  if (enableI18next) {
    configs.push(
      ...compat.extends('plugin:i18next/recommended').map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx,js,jsx}'],
      }))
    )
  }

  // Add Storybook config if enabled
  if (enableStorybook) {
    configs.push({
      files: ['**/*.stories.{ts,tsx}'],
      rules: {
        'i18next/no-literal-string': 'off',
        'max-len': 'off',
      },
    })
  }

  // Add Jest config if enabled
  if (enableJest) {
    configs.push({
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
        },
      },
      rules: {
        'i18next/no-literal-string': 'off',
        'max-len': 'off',
      },
    })
  }

  // Override for plain JavaScript files
  configs.push({
    files: ['**/*.js'],
    rules: {
      'consistent-return': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  })

    return configs
}