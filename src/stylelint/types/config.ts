import type { Config } from 'stylelint'

export interface BuildStylelintConfigOptions {
  /**
   * Enable semantic groups ordering for selectors and properties
   * @default true
   */
  enableSemanticGroups?: boolean

  /**
   * Enable SCSS-specific rules
   * @default true
   */
  enableScss?: boolean

  /**
   * Custom rules to override or extend base configuration
   * @default {}
   */
  customRules?: Config['rules']

  /**
   * Additional ignore patterns
   * @default []
   */
  ignoreFiles?: string[]

  /**
   * Additional plugins to load
   * @default []
   */
  additionalPlugins?: string[]

  /**
   * Maximum nesting depth
   * @default 4
   */
  maxNestingDepth?: number

  /**
   * Enforce specific color format
   * @default 'hex'
   */
    colorFormat?: 'hex' | 'rgb' | 'hsl' | null
}
