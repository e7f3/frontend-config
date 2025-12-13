import type { VitestConfig } from '../types/config'

/**
 * TypeScript Vitest preset optimized for .ts and .tsx files.
 * @returns VitestConfig - TypeScript-focused configuration with Node.js environment
 */
export function typescriptPreset(): VitestConfig {
    return {
        test: {
            globals: true,
            environment: 'node',
            include: [
                '**/__tests__/**/*.{ts,tsx}',
                '**/*.{spec,test}.{ts,tsx}',
            ],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
            ],
        },
    }
}