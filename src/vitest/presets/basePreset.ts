import type { VitestConfig } from '../types/config'

/**
 * Base Vitest preset for minimal JavaScript/TypeScript testing setup.
 * @returns VitestConfig - Base configuration with Node.js environment
 */
export function basePreset(): VitestConfig {
    return {
        test: {
            globals: true,
            environment: 'node',
            include: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
            exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        },
    }
}
