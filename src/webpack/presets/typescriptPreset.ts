import type { Configuration } from 'webpack';
import type { BuildOptions } from '../types/config';
import { buildWebpackConfig } from '../builders/buildWebpackConfig';

/**
 * TypeScript preset
 * Opinionated webpack configuration for TypeScript projects
 */
export function typescriptPreset(options: BuildOptions): Configuration {
  return buildWebpackConfig({
    ...options,
    mode: options.mode || 'development',
    // TypeScript-specific configuration is handled by the TypeScript loader
    // in the buildLoaders function
  });
}