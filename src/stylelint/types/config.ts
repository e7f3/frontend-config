import type { Config } from 'stylelint'

/**
 * Performance optimization levels for Stylelint configuration.
 */
export type PerformanceLevel = 'basic' | 'optimized' | 'maximum'

/**
 * Cache configuration options for performance optimization.
 */
export interface CacheConfig {
    /** Enable plugin caching for repeated runs */
    enableCaching?: boolean
    /** Cache directory path */
    cacheDirectory?: string
    /** Cache file name */
    cacheFile?: string
    /** TTL for cache entries in milliseconds */
    cacheTTL?: number
}

/**
 * Parallel processing configuration.
 */
export interface ParallelConfig {
    /** Enable parallel processing for better performance */
    parallelProcessing?: boolean
    /** Maximum concurrency for parallel processing */
    maxConcurrency?: number
    /** Memory limit per worker process in MB */
    memoryLimit?: number
    /** Worker timeout in milliseconds */
    workerTimeout?: number
}

/**
 * Performance monitoring configuration.
 */
export interface PerformanceConfig extends CacheConfig, ParallelConfig {
    /** Performance optimization level */
    performanceLevel?: PerformanceLevel
    /** Enable detailed performance metrics */
    enableMetrics?: boolean
    /** Performance monitoring interval */
    monitoringInterval?: number
}

/**
 * Build Stylelint configuration options with performance optimizations.
 */
export interface BuildStylelintConfigOptions {
    /** Enable semantic groups ordering for selectors and properties */
    enableSemanticGroups?: boolean
    /** Enable SCSS-specific rules */
    enableScss?: boolean
    /** Custom rules to override or extend base configuration */
    customRules?: Config['rules']
    /** Additional ignore patterns */
    ignoreFiles?: Array<string>
    /** Additional plugins to load */
    additionalPlugins?: Array<string>
    /** Maximum nesting depth for selectors */
    maxNestingDepth?: number
    /** Enforce specific color format */
    colorFormat?: 'hex' | 'rgb' | 'hsl' | null
    /** Performance optimization configuration */
    performance?: PerformanceConfig
    /** Custom semantic groups configuration for dynamic ordering */
    semanticGroups?: {
        customGroups?: Record<string, Array<string>>
        groupOrder?: Array<string>
        emptyLineBeforeGroups?: Array<'top' | 'bottom' | 'none'>
        /** Enable caching for semantic groups */
        enableCache?: boolean
        /** Cache configuration for semantic groups */
        cacheConfig?: CacheConfig
    }
    /** Enable modern SCSS rules for better performance */
    enableModernScss?: boolean
    /** Code formatting integration settings */
    formatterIntegration?: {
        /** Enable Prettier integration */
        enablePrettier?: boolean
        /** Prettier configuration override */
        prettierConfig?: Record<string, unknown>
        /** Disable conflicting Stylelint rules for Prettier */
        disableConflictingRules?: boolean
    }
    /** CSS framework specific configuration */
    frameworkSupport?: {
        /** Enable Tailwind CSS support */
        tailwind?: boolean
        /** Enable Styled Components support */
        styledComponents?: boolean
        /** Enable Emotion CSS-in-JS support */
        emotion?: boolean
        /** Enable CSS Modules support */
        cssModules?: boolean
    }
    /** React-specific styling configuration */
    reactSupport?: {
        /** Enable React-specific rules */
        enabled?: boolean
        /** Support for styled-components in React */
        styledComponents?: boolean
        /** Support for CSS modules in React components */
        cssModules?: boolean
        /** Support for inline styles */
        inlineStyles?: boolean
    }
}

/**
 * Performance metrics for Stylelint execution.
 */
export interface StylelintMetrics {
    /** Execution time in milliseconds */
    executionTime: number
    /** Memory usage in bytes */
    memoryUsage: number
    /** Number of files processed */
    filesProcessed: number
    /** Cache hit rate percentage */
    cacheHitRate: number
    /** Number of rules evaluated */
    rulesEvaluated: number
    /** Number of violations found */
    violationsFound: number
}

/**
 * Stylelint configuration result with performance data.
 */
export interface StylelintConfigResult extends Config {
    /** Performance metrics for this configuration */
    performanceMetrics?: StylelintMetrics
    /** Configuration version for caching */
    version: string
    /** Build timestamp for cache invalidation */
    buildTimestamp: number
}
