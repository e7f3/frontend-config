import HtmlWebpackPlugin from 'html-webpack-plugin'

import type { BuildOptions } from '../types/config'

/**
 * HTML plugin configuration for webpack.
 */

/**
 * Builds HtmlWebpackPlugin configuration.
 * @param options - Build options containing paths and environment settings
 * @returns HtmlWebpackPlugin instance configured for current environment
 */
export function buildHtmlPlugin(options: BuildOptions): HtmlWebpackPlugin {
    const { paths, isDev } = options

    return new HtmlWebpackPlugin({
        template: paths.html,
        favicon: paths.public ? `${paths.public}/favicon.ico` : undefined,
        minify: isDev
            ? false
            : {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
    })
}
