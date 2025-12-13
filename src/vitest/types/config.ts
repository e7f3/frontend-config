/**
 * TypeScript type definitions for Vitest configuration system.
 */

/**
 * Available preset types for Vitest configuration.
 */
export type VitestPreset = 'base' | 'react' | 'typescript'

/**
 * Complete Vitest configuration interface with test runner options.
 */
export interface VitestConfig {
    /** Test runner configuration options */
    test?: {
        /** Enable global test functions */
        globals?: boolean

        /** Test environment to use */
        environment?: string

        /** Setup files to run before tests */
        setupFiles?: Array<string>

        /** Test file inclusion patterns */
        include?: Array<string>

        /** Test file exclusion patterns */
        exclude?: Array<string>

        /** Test coverage configuration */
        coverage?: {
            /** Coverage provider to use */
            provider?: string

            /** Enable coverage reporting */
            enabled?: boolean

            /** Coverage reporters to generate */
            reporter?: Array<string>

            /** Files and directories to exclude from coverage */
            exclude?: Array<string>

            /** Coverage thresholds */
            threshold?: {
                /** Global coverage thresholds */
                global?: {
                    /** Minimum line coverage percentage */
                    lines?: number

                    /** Minimum function coverage percentage */
                    functions?: number

                    /** Minimum branch coverage percentage */
                    branches?: number

                    /** Minimum statement coverage percentage */
                    statements?: number
                }
            }
        }
    }
}

/**
 * Extended interface for buildVitestConfig function with preset selection.
 */
export interface VitestOptions extends Partial<VitestConfig> {
    /** Configuration preset to use */
    preset?: VitestPreset
}