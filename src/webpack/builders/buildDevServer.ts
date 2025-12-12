import type { BuildOptions } from '../types/config'

export function buildDevServer(options: BuildOptions): any {
    const { isDev, port, paths } = options

    if (!isDev) {
        return {}
    }

    return {
        port: port || 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
        compress: true,
        static: {
            directory: paths.output,
            publicPath: '/',
        },
        devMiddleware: {
            writeToDisk: false,
            stats: 'minimal',
        },
        // Enable HTTPS if needed
        // https: true,
        // Enable gzip compression
        // compress: 'gzip',
        // Enable WebSocket transport
        webSocketServer: 'ws',
        // Enable live reloading
        liveReload: true,
        // Watch files for changes
        watchFiles: {
            paths: ['src/**/*'],
            options: {
                usePolling: true,
                interval: 1000,
            },
        },
    }
}
