'use strict'

/**
 * ESLint configuration system with TypeScript, React, and accessibility support.
 * Provides production-ready ESLint setup following modern flat config format.
 */

export { buildEslintConfig } from './buildEslintConfig'
export type { BuildConfigOptions, RuleConfig, ExtendedRuleConfig, RuleSeverity, RuleCategory, ConfigurationPreset } from './types/config'

// Re-export main configuration function for convenience
export { buildEslintConfig as eslintConfig } from './buildEslintConfig'
