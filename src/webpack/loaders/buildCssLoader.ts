import type { RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { CssLoaderOptions } from '../types/config';

/**
 * Builds CSS/SCSS loader configuration
 * Handles CSS modules, SCSS preprocessing, and PostCSS
 */
export function buildCssLoader(options: CssLoaderOptions): RuleSetRule {
  const { isDev, modules = true } = options;

  return {
    test: /\.s?css$/,
    use: [
      // Extract CSS to separate file in production, use style-loader in dev for HMR
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: modules ? {
            auto: (resPath: string) => resPath.includes('.module.'),
            localIdentName: isDev
              ? '[path][name]__[local]--[hash:base64:5]'
              : '[hash:base64:8]',
          } : false,
          sourceMap: isDev,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              'autoprefixer',
            ],
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: isDev,
        },
      },
    ],
  };
}
