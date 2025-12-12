import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import * as webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { buildDefinePlugin } from '../plugins/buildDefinePlugin'
import { buildHtmlPlugin } from '../plugins/buildHtmlPlugin'
import { buildMiniCssExtractPlugin } from '../plugins/buildMiniCssExtractPlugin'
import { buildProgressPlugin } from '../plugins/buildProgressPlugin'
import type { BuildOptions } from '../types/config'

/**
 * Main plugins builder
 * Combines all plugin configurations into a single array
 */
export function buildPlugins(options: BuildOptions): Array<webpack.WebpackPluginInstance | webpack.WebpackPluginFunction> {
    const { isDev, analyzer } = options

    const plugins = [buildHtmlPlugin(options), buildDefinePlugin(options), buildMiniCssExtractPlugin(options), buildProgressPlugin(options)]

    // Add React Refresh plugin in development mode
    if (isDev) {
        plugins.push(new ReactRefreshWebpackPlugin())
    }

    if (analyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    return plugins
}
