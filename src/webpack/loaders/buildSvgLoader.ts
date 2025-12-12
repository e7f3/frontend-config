import type { RuleSetRule } from 'webpack'

/**
 * Builds SVG loader configuration
 * Uses SVGR to import SVGs as React components with fallback to asset/resource
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
