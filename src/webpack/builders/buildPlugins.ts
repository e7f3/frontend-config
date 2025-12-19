import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { buildDefinePlugin } from '../plugins/buildDefinePlugin'
import { buildHtmlPlugin } from '../plugins/buildHtmlPlugin'
import { buildMiniCssExtractPlugin } from '../plugins/buildMiniCssExtractPlugin'
import { buildProgressPlugin } from '../plugins/buildProgressPlugin'
import type { BuildOptions } from '../types/config'

/**
 * Webpack plugins configuration builder.
 */

/**
 * Builds webpack plugins configuration.
 * @param options - Build options including environment settings and feature toggles
 * @returns Array of webpack plugin instances configured for current environment
 */
export function buildPlugins(options: BuildOptions): Array<webpack.WebpackPluginInstance | webpack.WebpackPluginFunction> {
    const { isDev, analyzer } = options

    const plugins = [buildHtmlPlugin(options), buildDefinePlugin(options), buildMiniCssExtractPlugin(options), buildProgressPlugin(options)]

    // Add React Refresh plugin in development mode
    if (isDev) {
        plugins.push(new ReactRefreshWebpackPlugin())
    }

    // Add bundle analyzer in development mode if enabled
    if (analyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    return plugins
}
