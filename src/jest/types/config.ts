import type { Config } from '@jest/types'

/**
 * Jest configuration types and interfaces.
 */

/**
 * Jest preset configuration types.
 */
export type JestPreset = 'base' | 'react' | 'typescript'

/**
 * Jest configuration type (re-export from @jest/types).
 */
export type JestConfig = Config.InitialOptions

/**
 * Extended Jest configuration builder options.
 */
export interface JestOptions extends Partial<JestConfig> {
    /** Configuration preset to use for optimized defaults */
    preset?: JestPreset
}
