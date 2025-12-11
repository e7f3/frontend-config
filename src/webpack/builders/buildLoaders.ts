import type { RuleSetRule } from 'webpack';
import { buildCssLoader } from '../loaders/buildCssLoader';
import { buildSvgLoader } from '../loaders/buildSvgLoader';
import { buildBabelLoader } from '../loaders/buildBabelLoader';
import { buildTsLoader } from '../loaders/buildTsLoader';
import { buildImageLoader } from '../loaders/buildImageLoader';
import { buildFontLoader } from '../loaders/buildFontLoader';
import type { BuildOptions } from '../types/config';

/**
 * Main loaders builder
 * Combines all loader configurations into a single array
 */
export function buildLoaders(options: BuildOptions): RuleSetRule[] {
  const { isDev } = options;

  return [
    buildBabelLoader(),
    buildTsLoader({ isDev, useEsbuild: true }),
    buildCssLoader({ isDev, modules: true }),
    buildSvgLoader(),
    buildImageLoader(),
    buildFontLoader(),
  ];
}