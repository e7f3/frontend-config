/**
 * Shared types used across multiple configuration builders
 */

/**
 * Build mode - development or production
 */
export type BuildMode = 'development' | 'production';

/**
 * Build environment - local, staging, or production
 */
export type BuildEnv = 'local' | 'staging' | 'production';

/**
 * Target platform for the build
 */
export type BuildPlatform = 'desktop' | 'mobile' | 'universal';

/**
 * Common paths used in build configurations
 */
export interface BuildPaths {
  /** Entry point for the application */
  entry: string;
  /** Output directory for built files */
  output: string;
  /** Source directory */
  src: string;
  /** Public/static assets directory (optional) */
  public?: string;
  /** HTML template file (optional, for webpack) */
  html?: string;
}
