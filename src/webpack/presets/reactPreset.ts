import type { Configuration } from 'webpack';
import type { BuildOptions } from '../types/config';
import { buildWebpackConfig } from '../builders/buildWebpackConfig';

/**
 * React preset
 * Opinionated webpack configuration for React projects
 */
export function reactPreset(options: BuildOptions): Configuration {
  return buildWebpackConfig({
    ...options,
    mode: options.mode || 'development',
    // React-specific configuration is handled by the loaders and plugins
  });
}