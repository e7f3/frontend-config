import type { RuleSetRule } from 'webpack'

/**
 * Builds Babel loader configuration
 * Handles JSX/JS/TSX/TS transpilation with React and TypeScript presets
 */
export function buildBabelLoader(): RuleSetRule {
    return {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: '> 0.25%, not dead',
                            useBuiltIns: 'usage',
                            corejs: 3,
                        },
                    ],
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                ],
                plugins: [
                    // Add React refresh plugin for HMR in development
                    // This will be added conditionally by the buildLoaders function
                ],
            },
        },
    }
}
