import type { Configuration } from 'webpack';
import type { BuildOptions } from '../types/config';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolvers } from './buildResolvers';
import { buildDevServer } from './buildDevServer';
import { buildOptimization } from './buildOptimization';

/**
 * Main webpack orchestrator
 * Combines all builders into a complete webpack configuration
 */
export function buildWebpackConfig(options: BuildOptions): Configuration {
  return {
    mode: options.mode,
    entry: options.paths.entry,
    output: {
      path: options.paths.output,
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    plugins: buildPlugins(options),
    devServer: buildDevServer(options),
    optimization: buildOptimization(options),
  };
}