import type { JestConfig } from '../types/config'

/**
 * Base Jest preset configuration
 * Minimal setup for JavaScript/TypeScript projects
 */
export function basePreset(): JestConfig {
    return {
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
        moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}', '!src/**/__tests__/**'],
    }
}
