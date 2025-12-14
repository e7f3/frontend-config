import type { VitestConfig } from '../types/config'

/**
 * React Vitest preset with JSDOM environment and Testing Library integration.
 * @returns VitestConfig - React-focused configuration for component testing
 */
export function reactPreset(): VitestConfig {
    return {
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['<rootDir>/node_modules/@testing-library/jest-dom'],
            include: [
                '**/__tests__/**/*.{js,jsx,ts,tsx}',
                '**/*.{spec,test}.{js,jsx,ts,tsx}',
            ],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
            ],
        },
    }
}