import type { JestConfig } from '../types/config'

/**
 * Base Jest preset with SWC-Jest performance optimization.
 */

/**
 * Base Jest preset with SWC-Jest for optimal performance.
 * @returns Complete Jest configuration for Node.js testing
 */
export function basePreset(): JestConfig {
    return {
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
        moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}', '!src/**/__tests__/**'],
        
        // SWC-Jest configuration for optimal performance (2000%+ improvement)
        transform: {
            '^.+\\.(ts|tsx)$': ['@swc/jest', {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                        decorators: true,
                    },
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            }],
            '^.+\\.(js|jsx)$': ['@swc/jest', {
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
            }],
        },
        
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
