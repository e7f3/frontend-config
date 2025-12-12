# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-12

### Added

#### Core Features
- Initial release of @e7f3/frontend-config
- TypeScript-first configuration builders with full type safety
- Modular architecture with separate exports for each tool

#### ESLint Configuration
- ESLint 9 flat config builder with TypeScript and React support
- Automatic i18next translation linting (optional)
- Storybook-specific rule overrides (optional)
- Jest test file configuration with globals (optional)
- Import ordering and path resolution rules
- TypeScript naming conventions enforcement
- React Hooks linting rules
- Accessibility (a11y) rules via jsx-a11y plugin
- Configurable ignore patterns and custom rules
- Custom tsconfig.json path support

#### Webpack Configuration
- Webpack 5 configuration builder with multiple presets
- React preset with hot module replacement (HMR) support
- Vanilla JavaScript/TypeScript preset
- TypeScript-optimized preset
- Production optimization with content hashing
- Bundle analyzer integration (optional)
- Source maps for development and production
- Asset optimization (images, fonts, etc.)
- SCSS/Sass support with PostCSS
- Development server with hot reload
- Environment variable injection via DefinePlugin
- Automatic chunk splitting and tree shaking
- Compression plugin for production builds

#### Jest Configuration
- Jest 29+ configuration builder with preset support
- Base preset for minimal setup
- React preset with Testing Library and jsdom
- TypeScript preset with ts-jest
- Configurable coverage collection and thresholds
- Custom test matchers and transforms
- Module name mapping support
- Coverage reporters configuration

#### Stylelint Configuration
- Stylelint 16 configuration builder
- SCSS support with stylelint-config-standard-scss
- Semantic CSS property ordering (optional)
- Configurable indentation (spaces or tabs)
- Max nesting depth rules
- Color format enforcement
- Custom rules support
- File ignore patterns

#### Developer Experience
- Comprehensive JSDoc documentation for all APIs
- Full TypeScript type definitions
- Runtime validation with helpful error messages
- EditorConfig support for consistent formatting
- Prettier integration for code formatting
- Example configurations for common use cases

### Documentation
- Complete README with installation instructions
- API reference for all configuration builders
- Quick start guides for each tool
- Advanced usage examples
- Troubleshooting guide
- Migration guide from ESLint 8 to ESLint 9
- Contributing guidelines

### Build & Development
- TypeScript compilation with Node16 module resolution
- Source maps and declaration maps
- Separate build and development configurations
- Automatic formatting with Prettier
- Linting for source code
- Pre-publish validation scripts

### Dependencies
- Modern dependency versions (ESLint 9, Webpack 5, Jest 30, Stylelint 16)
- Peer dependencies for flexibility
- Optional peer dependencies for modular usage
- Minimal required dependencies

### Security
- No known vulnerabilities in dependencies
- Strict TypeScript configuration
- Input validation for all configuration options

## [Unreleased]

### Planned
- Additional Webpack presets (Vue, Svelte, Angular)
- Prettier configuration builder
- Babel configuration builder
- TypeScript configuration builder
- PostCSS configuration builder
- Example projects repository
- Interactive configuration generator CLI
- VS Code extension for quick setup
- GitHub Actions workflow templates

---

## Release Notes

### Version 1.0.0

This is the initial stable release of @e7f3/frontend-config. The package provides production-ready configuration builders for modern frontend tooling, eliminating the need to copy-paste configuration files between projects.

**Key Features:**
- Type-safe configuration builders
- Zero-config defaults with full customization
- Support for ESLint 9, Webpack 5, Jest 30, Stylelint 16
- React-optimized presets
- Comprehensive documentation

**Requirements:**
- Node.js >= 18.0.0
- npm >= 9.0.0

**Breaking Changes:**
- N/A (initial release)

**Migration:**
- N/A (initial release)

---

For upgrade instructions and more details, see the [README](https://github.com/e7f3/frontend-config#readme).

[1.0.0]: https://github.com/e7f3/frontend-config/releases/tag/v1.0.0
