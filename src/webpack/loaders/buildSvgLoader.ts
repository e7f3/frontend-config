import type { RuleSetRule } from 'webpack'

/**
 * SVG loader configuration for webpack.
 */

/**
 * Builds SVG loader configuration.
 * @returns RuleSetRule configuration for SVG processing
 */
export function buildSvgLoader(): RuleSetRule {
    return {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                },
                            },
                        ],
                    },
                },
            },
        ],
    }
}
