import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { BuildOptions } from '../types/config';

/**
 * Builds HtmlWebpackPlugin configuration
 * Generates HTML file with script tags for bundled assets
 */
export function buildHtmlPlugin(options: BuildOptions): HtmlWebpackPlugin {
  const { paths, isDev } = options;

  return new HtmlWebpackPlugin({
    template: paths.html,
    favicon: paths.public ? `${paths.public}/favicon.ico` : undefined,
    minify: isDev ? false : {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  });
}
