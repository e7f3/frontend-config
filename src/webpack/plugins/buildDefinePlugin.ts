import webpack from 'webpack';
import type { BuildOptions } from '../types/config';

/**
 * Builds DefinePlugin configuration
 * Injects global constants at compile time
 */
export function buildDefinePlugin(options: BuildOptions): webpack.DefinePlugin {
  const { mode, isDev, apiUrl } = options;

  const env = {
    __IS_DEV__: JSON.stringify(isDev),
    __IS_PROD__: JSON.stringify(!isDev),
    __MODE__: JSON.stringify(mode),
    __API_URL__: JSON.stringify(apiUrl || ''),
  };

  return new webpack.DefinePlugin({
    'process.env': env,
  });
}
