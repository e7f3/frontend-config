import type { RuleSetRule } from 'webpack'

/**
 * Image loader configuration for webpack.
 */

/**
 * Builds image loader configuration.
 * @returns RuleSetRule configuration for image asset processing
 */
export function buildImageLoader(): RuleSetRule {
    return {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'images/[name][ext][query]',
        },
    }
}
