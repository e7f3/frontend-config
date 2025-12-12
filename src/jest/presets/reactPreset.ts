import type { JestConfig } from '../types/config'

/**
 * React Jest preset configuration
 * Includes Testing Library and JSDOM environment
 */
export function reactPreset(): JestConfig {
    return {
        testEnvironment: 'jsdom',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
        setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom'],
        moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
        transform: {
            '^.+\\.(ts|tsx)$': 'ts-jest',
            '^.+\\.(js|jsx)$': 'babel-jest',
        },
        moduleNameMapper: {
            '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
            '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
        },
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}', '!src/**/__tests__/**'],
    }
}
