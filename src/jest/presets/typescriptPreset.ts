import type { JestConfig } from '../types/config'

/**
 * TypeScript Jest preset configuration
 * Optimized for TypeScript projects with ts-jest
 */
export function typescriptPreset(): JestConfig {
    return {
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
        transform: {
            '^.+\\.(ts|tsx)$': [
                'ts-jest',
                {
                    tsconfig: {
                        esModuleInterop: true,
                    },
                },
            ],
        },
        collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**'],
    }
}
