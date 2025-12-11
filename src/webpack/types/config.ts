import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { BuildMode, BuildPaths, BuildPlatform } from '../../shared/types';

/**
 * Environment variables passed to webpack config builder
 */
export interface BuildEnv {
  mode?: BuildMode;
  port?: number;
  analyzer?: boolean;
  platform?: BuildPlatform;
  apiUrl?: string;
}

/**
 * Complete options object for webpack config builders
 */
export interface BuildOptions {
  /** Build mode - development or production */
  mode: BuildMode;
  /** Path configuration */
  paths: BuildPaths;
  /** Convenience flag - true when mode is 'development' */
  isDev: boolean;
  /** Convenience flag - true when mode is 'production' */
  isProd: boolean;
  /** Dev server port (optional) */
  port?: number;
  /** Target platform (optional) */
  platform?: BuildPlatform;
  /** Enable webpack bundle analyzer (optional) */
  analyzer?: boolean;
  /** Enable source maps (optional, defaults based on mode) */
  sourceMaps?: boolean;
  /** API URL for DefinePlugin (optional) */
  apiUrl?: string;
  /** Project root path (optional, defaults to process.cwd()) */
  rootPath?: string;
}

/**
 * Options for CSS loader builder
 */
export interface CssLoaderOptions {
  /** Enable CSS modules */
  modules?: boolean;
  /** Development mode flag */
  isDev: boolean;
}

/**
 * Options for TypeScript loader builder
 */
export interface TsLoaderOptions {
  /** Use esbuild-loader for faster compilation in dev */
  useEsbuild?: boolean;
  /** Development mode flag */
  isDev: boolean;
}

/**
 * Complete webpack configuration with dev server
 */
export interface WebpackConfigWithDevServer extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}
