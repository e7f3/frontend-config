import type { RuleSetRule } from 'webpack'

/**
 * Font loader configuration for webpack.
 */

/**
 * Builds font loader configuration.
 * @returns RuleSetRule configuration for font asset processing
 */
export function buildFontLoader(): RuleSetRule {
    return {
        test: /\.(ttf|otf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'fonts/[name][ext][query]',
        },
    }
}
