import type { RuleSetRule } from 'webpack'

import { buildBabelLoader } from '../loaders/buildBabelLoader'
import { buildCssLoader } from '../loaders/buildCssLoader'
import { buildFontLoader } from '../loaders/buildFontLoader'
import { buildImageLoader } from '../loaders/buildImageLoader'
import { buildSvgLoader } from '../loaders/buildSvgLoader'
import { buildTsLoader } from '../loaders/buildTsLoader'
import type { BuildOptions } from '../types/config'

/**
 * Main loaders builder
 * Combines all loader configurations into a single array
 */
export function buildLoaders(options: BuildOptions): RuleSetRule[] {
    return [buildBabelLoader(), buildTsLoader(options), buildCssLoader(options), buildSvgLoader(), buildImageLoader(), buildFontLoader()]
}
