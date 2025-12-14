import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import type { BuildOptions } from '../types/config'

/**
 * Mini CSS Extract plugin configuration for webpack.
 */

/**
 * Builds MiniCssExtractPlugin configuration for extracting CSS into separate files.
 * @param options - Build options containing environment configuration
 * @returns MiniCssExtractPlugin instance configured for the current environment
 */
export function buildMiniCssExtractPlugin(options: BuildOptions): MiniCssExtractPlugin {
    const { isDev } = options

    return new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : 'css/[name].[contenthash:8].css',
        chunkFilename: isDev ? '[id].css' : 'css/[id].[contenthash:8].css',
    })
}
