import type { ResolveOptions } from 'webpack';
import type { BuildOptions } from '../types/config';

/**
 * Main resolvers builder
 * Configures module resolution for the webpack configuration
 */
export function buildResolvers(options: BuildOptions): ResolveOptions {
  const { paths } = options;

  return {
    modules: ['node_modules', paths.src],
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': paths.src,
    },
  };
}