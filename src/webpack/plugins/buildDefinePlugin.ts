import webpack from 'webpack'

import type { BuildOptions } from '../types/config'

/**
 * Define plugin configuration for webpack.
 */

/**
 * Builds DefinePlugin configuration for injecting global constants.
 * @param options - Build options containing environment and configuration
 * @returns DefinePlugin instance configured for the current environment
 */
export function buildDefinePlugin(options: BuildOptions): webpack.DefinePlugin {
    const { mode, isDev, env } = options

    const envVariables = {
        __IS_DEV__: JSON.stringify(isDev),
        __IS_PROD__: JSON.stringify(!isDev),
        __MODE__: JSON.stringify(mode),
        __API_URL__: JSON.stringify(env?.apiUrl || ''),
    }

    return new webpack.DefinePlugin({
        'process.env': envVariables,
    })
}
