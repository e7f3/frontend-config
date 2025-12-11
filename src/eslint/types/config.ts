"use strict";

import { Linter } from "eslint";

export interface BuildConfigOptions {
  /**
   * Enable i18next rules for internationalization
   * @default true
   */
  enableI18next?: boolean
  
  /**
   * Enable Storybook-specific rule overrides
   * @default true
   */
  enableStorybook?: boolean
  
  /**
   * Enable Jest-specific rule overrides
   * @default true
   */
  enableJest?: boolean
  
  /**
   * Custom rules to override or extend base configuration
   * @default {}
   */
  customRules?: Linter.RulesRecord
  
  /**
   * Additional patterns to ignore
   * @default []
   */
  ignorePatterns?: string[]
  
  /**
   * Path to tsconfig.json for TypeScript type checking
   * @default './tsconfig.json'
   */
  tsconfigPath?: string
}
