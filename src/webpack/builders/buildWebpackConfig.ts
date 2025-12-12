import { buildDevServer } from './buildDevServer'
import { buildLoaders } from './buildLoaders'
import { buildOptimization } from './buildOptimization'
import { buildPlugins } from './buildPlugins'
import { buildResolvers } from './buildResolvers'
import type { BuildOptions, WebpackConfiguration } from '../types/config'

/**
 * Main webpack orchestrator
 * Combines all builders into a complete webpack configuration
 */
export function buildWebpackConfig(options: BuildOptions): WebpackConfiguration {
    const isProd = options.mode === 'production'

    return {
        mode: options.mode,
        entry: options.paths.entry,
        output: {
            path: options.paths.output,
            filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
            chunkFilename: isProd ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
            assetModuleFilename: 'assets/[name].[hash:8][ext]',
            clean: true,
            publicPath: options.publicPath ?? '/',
        },
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        plugins: buildPlugins(options),
        devServer: options.isDev ? buildDevServer(options) : undefined,
        optimization: buildOptimization(options),
        devtool: isProd ? 'source-map' : 'eval-source-map',
        performance: {
            hints: isProd ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
    }
}
