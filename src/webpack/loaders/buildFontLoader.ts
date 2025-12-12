import type { RuleSetRule } from 'webpack'

/**
 * Builds font loader configuration
 * Handles TTF, OTF, WOFF, WOFF2, EOT, SVG font formats
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
