import type { Config } from '@jest/types'

/**
 * Jest preset types
 */
export type JestPreset = 'base' | 'react' | 'typescript'

/**
 * Jest configuration type (re-export from @jest/types)
 */
export type JestConfig = Config.InitialOptions

/**
 * Jest configuration builder options
 */
export interface JestOptions extends Partial<JestConfig> {
    /**
     * Configuration preset to use
     * - 'base': Minimal Jest configuration
     * - 'react': React + Testing Library setup
     * - 'typescript': TypeScript-optimized setup
     * @default 'base'
     */
    preset?: JestPreset
}
