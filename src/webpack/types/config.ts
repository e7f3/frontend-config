import type { Configuration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

import type { PerformancePluginOptions, BuildMonitoringConfig } from './performance'

/**
 * Webpack build paths configuration.
 */
export interface BuildPaths {
    /** Entry point file path (e.g., './src/index.tsx') */
    entry: string
    /** Output directory path (e.g., './dist') */
    output: string
    /** HTML template file path (e.g., './public/index.html') */
    html: string
    /** Source directory path (e.g., './src') */
    src: string
    /** Public assets directory path (optional) */
    public?: string
}

/**
 * Webpack build configuration options.
 */
export interface BuildOptions {
    /** Build mode - 'development' or 'production' */
    mode: 'development' | 'production'
    /** Path configuration for build */
    paths: BuildPaths
    /** Whether this is a development build (enables dev server, etc.) */
    isDev?: boolean
    /** Development server port number (default: 3000) */
    port?: number
    /** Enable webpack bundle analyzer (default: false) */
    analyzer?: boolean
    /** Public path for assets (default: '/') */
    publicPath?: string
    /** Target platform for build optimization */
    platform?: NodeJS.Platform
    /** Env variables */
    env?: EnvVariables
    /** Performance monitoring configuration */
    performanceMonitoring?: PerformancePluginOptions
    /** Build monitoring configuration */
    buildMonitoring?: BuildMonitoringConfig
}

/**
 * Environment variables for webpack configuration.
 */
export interface EnvVariables {
    /** Build mode */
    mode: 'development' | 'production'
    /** Development server port */
    port?: number
    /** Enable bundle analyzer */
    analyzer?: boolean
    /** API URL for environment configuration */
    apiUrl?: string
}

export interface WebpackConfiguration extends Configuration {
    devServer?: DevServerConfiguration
}
