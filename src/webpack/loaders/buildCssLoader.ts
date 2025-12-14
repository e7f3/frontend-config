import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import type { RuleSetRule } from 'webpack'

import { BuildOptions } from '../types/config'

/**
 * CSS/SCSS loader configuration builder.
 */

/**
 * Builds CSS/SCSS loader configuration.
 * @param options - Build options containing environment configuration
 * @returns RuleSetRule configuration for CSS processing
 */
export function buildCssLoader(options: BuildOptions): RuleSetRule {
    const { isDev } = options

    return {
        test: /\.s?css$/,
        use: [
            // Extract CSS to separate file in production, use style-loader in dev for HMR
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath: string) => resPath.includes('.module.'),
                        localIdentName: isDev
                            ? '[path][name]__[local]--[hash:base64:5]'
                            : '[hash:base64:8]',
                    },
                    sourceMap: isDev,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['autoprefixer'],
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: isDev,
                },
            },
        ],
    }
}
