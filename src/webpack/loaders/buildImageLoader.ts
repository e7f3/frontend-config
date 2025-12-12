import type { RuleSetRule } from 'webpack'

/**
 * Builds image loader configuration
 * Handles PNG, JPG, JPEG, GIF, WebP formats
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
