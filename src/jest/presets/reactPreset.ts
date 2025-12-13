import type { JestConfig } from '../types/config'

/**
 * React Jest preset with JSDOM and Testing Library integration.
 */

/**
 * React Jest preset with SWC-Jest and JSDOM 22.x.
 * @returns Complete Jest configuration for React testing
 */
export function reactPreset(): JestConfig {
    return {
        // JSDOM 22.x with modern features for optimal performance
        testEnvironment: 'jsdom',
        testEnvironmentOptions: {
            url: 'http://localhost',
            pretendToBeVisual: true,
            resources: 'usable',
            virtualConsole: true,
        },
        
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
        setupFilesAfterEnv: [
            '<rootDir>/node_modules/@testing-library/jest-dom',
        ],
        moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
        
        // SWC-Jest configuration for optimal React performance (2000%+ improvement over babel-jest/ts-jest)
        transform: {
            '^.+\\.(ts|tsx)$': ['@swc/jest', {
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
                            development: false,
                            refresh: false,
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
                            development: false,
                        },
                    },
                },
            }],
        },
        
        // Optimized module mapping for React assets
        moduleNameMapper: {
            '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
            '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
            // React Router and other common mappings
            '^react-router$': '<rootDir>/__mocks__/reactRouterMock.js',
            '^@testing-library/react$': '@testing-library/react',
        },
        
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}', '!src/**/__tests__/**'],
        
        // Performance optimizations for React testing
        cacheDirectory: '<rootDir>/.jest-cache',
        cache: true,
        maxWorkers: '50%',
        testTimeout: 3000,
        detectOpenHandles: true,
        forceExit: true,
        clearMocks: true,
        resetMocks: true,
        restoreMocks: true,
        
        // Enhanced test isolation
        maxConcurrency: 5,
    }
}
