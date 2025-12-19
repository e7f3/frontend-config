import type { RuleSetRule } from 'webpack'

import { buildBabelLoader } from '../loaders/buildBabelLoader'
import { buildCssLoader } from '../loaders/buildCssLoader'
import { buildFontLoader } from '../loaders/buildFontLoader'
import { buildImageLoader } from '../loaders/buildImageLoader'
import { buildSvgLoader } from '../loaders/buildSvgLoader'
import { buildTsLoader } from '../loaders/buildTsLoader'
import type { BuildOptions } from '../types/config'

/**
 * Webpack loaders configuration builder.
 */

/**
 * Builds webpack loaders configuration.
 * @param options - Build options containing environment-specific loader configurations
 * @returns Array of webpack RuleSetRule configurations for all supported file types
 */
export function buildLoaders(options: BuildOptions): Array<RuleSetRule> {
    return [buildBabelLoader(), buildTsLoader(options), buildCssLoader(options), buildSvgLoader(), buildImageLoader(), buildFontLoader()]
}
