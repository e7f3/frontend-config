import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import type { BuildOptions } from '../types/config'

/**
 * Builds MiniCssExtractPlugin configuration
 * Extracts CSS into separate files for production
 */
export function buildMiniCssExtractPlugin(options: BuildOptions): MiniCssExtractPlugin {
    const { isDev } = options

    return new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : 'css/[name].[contenthash:8].css',
        chunkFilename: isDev ? '[id].css' : 'css/[id].[contenthash:8].css',
    })
}
