import webpack from 'webpack';
import type { BuildOptions } from '../types/config';

/**
 * Builds ProgressPlugin configuration
 * Shows compilation progress in the console
 */
export function buildProgressPlugin(options: BuildOptions): webpack.ProgressPlugin {
  return new webpack.ProgressPlugin({
    profile: options.isDev,
  });
}