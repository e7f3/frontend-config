# @e7f3/frontend-config

> Shared, reusable configuration builders for modern frontend projects

[![npm version](https://badge.fury.io/js/@e7f3%2Ffrontend-config.svg)](https://www.npmjs.com/package/@e7f3/frontend-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

## Overview

@e7f3/frontend-config provides battle-tested, production-ready configuration builders for modern frontend tooling. Stop copying configuration files between projects—use composable, type-safe builders instead.

## Features

- TypeScript-First: Fully typed configuration builders with IntelliSense support
- Highly Flexible: Customizable presets and granular options
- Zero-Config: Sensible defaults that work out of the box
- Modern Stack: ESLint 9, Webpack 5, Jest 30, Stylelint 16
- React-Optimized: Pre-configured for React with hot reload support
- Plugin-Based: Only install what you need
- Well-Documented: Comprehensive examples and API documentation

## Installation

npm install --save-dev @e7f3/frontend-config

### Peer Dependencies

Install only the tools you plan to use:

For ESLint (Recommended):
npm install --save-dev eslint@^9.0.0 @typescript-eslint/parser@^8.0.0 @typescript-eslint/eslint-plugin@^8.0.0 eslint-plugin-react@^7.33.0 eslint-plugin-react-hooks@^5.0.0 eslint-plugin-import@^2.29.0 eslint-plugin-jsx-a11y@^6.8.0 eslint-plugin-i18next

For Webpack (Optional):
npm install --save-dev webpack@^5.0.0 webpack-dev-server@^5.0.0 webpack-cli@^5.0.0

For Jest (Optional):
npm install --save-dev jest@^29.0.0 @types/jest@^29.0.0

For Stylelint (Optional):
npm install --save-dev stylelint@^16.0.0 stylelint-config-standard-scss@^16.0.0

## Quick Start

### ESLint Configuration

Create eslint.config.js in your project root:

import { buildEslintConfig } from '@e7f3/frontend-config/eslint'

export default buildEslintConfig({
  enableI18next: true,
  enableStorybook: true,
  enableJest: true,
})

### Webpack Configuration

Create webpack.config.js:

import { buildWebpackConfig, reactPreset } from '@e7f3/frontend-config/webpack'
import path from 'path'

const config = reactPreset({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  paths: {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: path.resolve(__dirname, 'dist'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    src: path.resolve(__dirname, 'src'),
  },
  port: 3000,
  analyzer: false,
})

export default buildWebpackConfig(config)

### Jest Configuration

Create jest.config.js:

import { buildJestConfig } from '@e7f3/frontend-config/jest'

export default buildJestConfig({
  preset: 'react',
  rootDir: __dirname,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
})

### Stylelint Configuration

Create stylelint.config.js:

import { buildStylelintConfig } from '@e7f3/frontend-config/stylelint'

export default buildStylelintConfig({
  enableSemanticGroups: true,
  enableScss: true,
  maxNestingDepth: 4,
  indentation: 2,
})

## API Reference

### ESLint

buildEslintConfig(options?)

Builds an ESLint flat config array with sensible defaults for TypeScript and React projects.

Parameters:
- enableI18next (boolean, default: true): Enable i18next translation linting rules
- enableStorybook (boolean, default: true): Disable string linting in Storybook files
- enableJest (boolean, default: true): Add Jest globals and disable certain rules in test files
- customRules (Linter.RulesRecord, default: {}): Custom ESLint rules to merge with defaults
- ignorePatterns (string[], default: []): Additional file patterns to ignore
- tsconfigPath (string, default: './tsconfig.json'): Path to TypeScript configuration file

Returns: Linter.Config[]

Example:

import { buildEslintConfig } from '@e7f3/frontend-config/eslint'

export default buildEslintConfig({
  enableI18next: false,
  customRules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'max-len': ['error', { code: 120 }],
  },
  ignorePatterns: ['**/generated/**', '**/vendor/**'],
})

### Webpack

buildWebpackConfig(options)

Builds a complete Webpack configuration object.

Parameters:
- mode ('development' | 'production', required): Build mode
- paths.entry (string, required): Entry point file path
- paths.output (string, required): Output directory path
- paths.html (string, required): HTML template path
- paths.src (string, required): Source directory path
- port (number, optional): Dev server port (default: 3000)
- analyzer (boolean, optional): Enable bundle analyzer (default: false)
- isDev (boolean, optional): Development mode flag
- publicPath (string, optional): Public path for assets (default: '/')
- env (object, optional): Environment variables to inject

Returns: webpack.Configuration

Presets:

reactPreset(options)

Pre-configured settings for React applications with hot module replacement.

import { reactPreset, buildWebpackConfig } from '@e7f3/frontend-config/webpack'

const config = reactPreset({
  mode: 'development',
  paths: {
    entry: './src/index.tsx',
    output: './dist',
    html: './public/index.html',
    src: './src',
  },
})

export default buildWebpackConfig(config)

vanillaPreset(options)

Minimal configuration for vanilla JavaScript/TypeScript projects.

typescriptPreset(options)

TypeScript-optimized configuration with advanced type checking.

### Jest

buildJestConfig(options)

Builds a Jest configuration object with preset support.

Parameters:
- preset ('base' | 'react' | 'typescript', default: 'base'): Configuration preset to use
- rootDir (string, default: process.cwd()): Root directory for tests
- collectCoverage (boolean, default: false): Enable coverage collection
- coverageDirectory (string, default: 'coverage'): Coverage output directory
- coverageThreshold (object): Coverage thresholds
- testTimeout (number, default: 5000): Test timeout in milliseconds
- verbose (boolean, default: false): Display individual test results

Returns: JestConfig

Example:

import { buildJestConfig } from '@e7f3/frontend-config/jest'

export default buildJestConfig({
  preset: 'react',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
})

### Stylelint

buildStylelintConfig(options?)

Builds a Stylelint configuration object with SCSS support.

Parameters:
- enableSemanticGroups (boolean, default: true): Enable property ordering by semantic groups
- enableScss (boolean, default: true): Enable SCSS-specific rules
- customRules (Config['rules'], default: {}): Custom Stylelint rules
- ignoreFiles (string[], default: []): Additional files to ignore
- maxNestingDepth (number, default: 4): Maximum selector nesting depth
- colorFormat ('hex' | 'rgb' | 'hsl' | null, default: 'hex'): Preferred color format
- indentation (number | 'tab', default: 2): Indentation size

Returns: Config

Example:

import { buildStylelintConfig } from '@e7f3/frontend-config/stylelint'

export default buildStylelintConfig({
  enableScss: true,
  maxNestingDepth: 3,
  indentation: 2,
  customRules: {
    'color-hex-length': 'short',
    'selector-max-id': 0,
  },
  ignoreFiles: ['**/vendor/**/*.scss'],
})

## Advanced Usage

### Custom ESLint Rules per Environment

import { buildEslintConfig } from '@e7f3/frontend-config/eslint'

const isProd = process.env.NODE_ENV === 'production'

export default buildEslintConfig({
  customRules: {
    'no-console': isProd ? 'error' : 'warn',
    'no-debugger': isProd ? 'error' : 'warn',
  },
})

### Webpack with Environment Variables

import { buildWebpackConfig, reactPreset } from '@e7f3/frontend-config/webpack'

const config = reactPreset({
  mode: 'production',
  paths: {
    entry: './src/index.tsx',
    output: './dist',
    html: './public/index.html',
    src: './src',
  },
  env: {
    apiUrl: 'https://api.example.com',
    customVar: 'my-value',
  },
})

export default buildWebpackConfig(config)

### Jest with Custom Transform

import { buildJestConfig } from '@e7f3/frontend-config/jest'

export default buildJestConfig({
  preset: 'react',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
})

## Code Formatting

This package is formatted with Prettier. To maintain consistency in your project:

npm install --save-dev prettier

Create .prettierrc.json:

{
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 140
}

Add scripts:

{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,scss}\""
  }
}

## Troubleshooting

### ESLint: "Cannot find module '@typescript-eslint/parser'"

Ensure you've installed all peer dependencies:

npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

### ESLint: TypeScript config not loading

Install jiti for TypeScript config support:

npm install --save-dev jiti

### Webpack: "Module not found: Error: Can't resolve 'react'"

Install React dependencies:

npm install react react-dom

### Jest: "Cannot find module 'ts-jest'"

Install Jest TypeScript support:

npm install --save-dev ts-jest @types/jest

### Stylelint: "Unknown rule 'order/properties-order'"

These plugins are included as dependencies, but if you encounter issues:

npm install --save-dev stylelint-order stylelint-semantic-groups

## Migration Guide

### From ESLint 8 to ESLint 9

This package uses ESLint 9's flat config format. If migrating from .eslintrc.json:

Before:
{
  "extends": ["airbnb", "plugin:react/recommended"],
  "rules": {
    "no-console": "warn"
  }
}

After:
import { buildEslintConfig } from '@e7f3/frontend-config/eslint'

export default buildEslintConfig({
  customRules: {
    'no-console': 'warn',
  },
})

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## GitHub Packages Authentication

This package is published to GitHub Packages. To install or publish, you need to configure authentication:

1. Create a `.env` file in your project root with your GitHub token:
```
GITHUB_TOKEN=your_github_personal_access_token_here
```

2. Generate a personal access token at: https://github.com/settings/tokens
   - Required scopes: `read:packages`, `write:packages`

3. Use the provided npm authentication script for commands that require authentication:
```bash
# Verify authentication
./scripts/npm-auth.sh whoami --registry=https://npm.pkg.github.com/

# Install from GitHub Packages
./scripts/npm-auth.sh install @e7f3/frontend-config

# Publish to GitHub Packages
./scripts/npm-auth.sh publish
```

Alternatively, you can export the token manually:
```bash
export GITHUB_TOKEN=$(grep GITHUB_TOKEN .env | cut -d'=' -f2)
npm whoami --registry=https://npm.pkg.github.com/
```

## Contributing

Contributions are welcome! Please read our Contributing Guide for details.

### Development Setup

git clone https://github.com/e7f3/frontend-config.git
cd frontend-config
npm install
npm run build
npm test

## Changelog

See CHANGELOG.md for release history.

## License

MIT © e7f3

## Support

- Documentation: https://github.com/e7f3/frontend-config#readme
- Issue Tracker: https://github.com/e7f3/frontend-config/issues
- Discussions: https://github.com/e7f3/frontend-config/discussions

Made with ❤️ by e7f3
