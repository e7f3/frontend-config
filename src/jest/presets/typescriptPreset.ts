import type { JestConfig } from '../types/config'

/**
 * TypeScript Jest preset with enhanced type support.
 */

/**
 * TypeScript Jest preset with SWC-Jest optimization.
 * @returns Complete Jest configuration for TypeScript testing
 */
export function typescriptPreset(): JestConfig {
    return {
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

        // SWC-Jest configuration for optimal TypeScript performance (2000%+ improvement over ts-jest)
        transform: {
            '^.+\\.(ts|tsx)$': [
                '@swc/jest',
                {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: true,
                            decorators: true,
                            dynamicImport: true,
                        },
                        transform: {
                            react: {
                                runtime: 'automatic',
                            },
                            typescript: {
                                decoratorsMetadata: true,
                            },
                        },
                        target: 'es2022',
                        externalHelpers: false,
                        keepClassNames: true,
                    },
                    sourceMaps: true,
                    inlineSources: true,
                },
            ],
            '^.+\\.(js|jsx)$': [
                '@swc/jest',
                {
                    jsc: {
                        parser: {
                            syntax: 'ecmascript',
                            jsx: true,
                        },
                        transform: {
                            react: {
                                runtime: 'automatic',
                            },
                        },
                    },
                },
            ],
        },

        collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**'],

        // Performance optimizations
        cacheDirectory: '<rootDir>/.jest-cache',
        cache: true,
        maxWorkers: '50%',
        testTimeout: 3000,
        detectOpenHandles: true,
        forceExit: true,
        clearMocks: true,
        resetMocks: true,
        restoreMocks: true,
    }
}
