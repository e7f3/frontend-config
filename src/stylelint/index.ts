'use strict'

import { buildStylelintConfig } from './buildStylelintConfig'

/**
 * Stylelint configuration system with performance optimizations.
 */

// Main configuration builder
export { buildStylelintConfig } from './buildStylelintConfig'

// Utility functions for advanced usage
export { propertyOrdering, selectorOrdering, createDynamicSemanticGroups } from './buildStylelintConfig'

// TypeScript type definitions
export type { BuildStylelintConfigOptions } from './types/config'

// Version information for compatibility checking
export const STYLELINT_CONFIG_VERSION = '2.0.0'
export const MIN_STYLELINT_VERSION = '16.0.0'

/**
 * Performance monitoring and optimization utilities.
 */
export class StylelintPerformanceOptimizer {
    private static instance: StylelintPerformanceOptimizer
    private readonly cache = new Map<string, unknown>()

    static getInstance(): StylelintPerformanceOptimizer {
        if (!StylelintPerformanceOptimizer.instance) {
            StylelintPerformanceOptimizer.instance = new StylelintPerformanceOptimizer()
        }
        return StylelintPerformanceOptimizer.instance
    }

    /**
     * Clear all caches for memory optimization.
     */
    clearCaches(): void {
        this.cache.clear()
    }

    /**
     * Get cache statistics for performance monitoring.
     */
    getCacheStats(): { size: number; keys: Array<string> } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        }
    }
}

/**
 * Create a pre-configured Stylelint instance with performance optimizations.
 * @param options - Configuration options
 * @returns Optimized Stylelint configuration
 */
export function createOptimizedStylelint(options: import('./types/config').BuildStylelintConfigOptions = {}): import('stylelint').Config {
    // Apply performance optimizations with backward compatibility
    const optimizedOptions = {
        ...options,
        performance: {
            enableCaching: true,
            parallelProcessing: false,
            maxConcurrency: 4,
            ...options.performance,
        },
    }

    return buildStylelintConfig(optimizedOptions)
}
