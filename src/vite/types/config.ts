/**
 * TypeScript type definitions for Vite configuration system.
 */

/**
 * React plugin options for Vite
 */
export interface ReactPluginOptions {
    /** Enable Fast Refresh */
    fastRefresh?: boolean
    /** JSX runtime - 'automatic' or 'classic' */
    jsxRuntime?: 'automatic' | 'classic'
    /** JSX import source */
    jsxImportSource?: string
    /** Babel plugins */
    babel?: {
        plugins?: Array<string>
        presets?: Array<string>
    }
}

/**
 * Vite User Config interface (simplified)
 */
export interface UserConfig {
    /** Root directory */
    root?: string
    /** Base public path */
    base?: string
    /** Build options */
    build?: BuildOptions
    /** Server options */
    server?: ServerOptions
    /** Plugins */
    plugins?: Array<any>
    /** Resolve options */
    resolve?: ResolveOptions
    /** CSS options */
    css?: CSSOptions
    /** JSON options */
    json?: JSONOptions
    /** ESBuild options */
    esbuild?: ESBuildOptions
    /** Optimize dependencies */
    optimizeDeps?: OptimizeDepsOptions
    /** Custom logger */
    logLevel?: 'info' | 'warn' | 'error' | 'silent'
}

interface BuildOptions {
    /** Output directory */
    outDir?: string
    /** Assets directory */
    assetsDir?: string
    /** Minify */
    minify?: boolean | 'terser' | 'esbuild'
    /** Source map */
    sourcemap?: boolean
    /** Target */
    target?: string | Array<string>
    /** Rollup options */
    rollupOptions?: RollupOptions
}

interface RollupOptions {
    /** Input */
    input?: Record<string, string>
    /** Output */
    output?: RollupOutputOptions
}

interface RollupOutputOptions {
    /** Manual chunks */
    manualChunks?: (id: string) => string | undefined
}

interface ServerOptions {
    /** Port */
    port?: number
    /** Host */
    host?: string | boolean
    /** HTTPS */
    https?: boolean
    /** Proxy */
    proxy?: Record<string, string | object>
    /** Open browser automatically */
    open?: boolean
}

interface ResolveOptions {
    /** Aliases */
    alias?: Record<string, string>
    /** Extensions */
    extensions?: Array<string>
}

interface CSSOptions {
    /** Modules */
    modules?: CSSModulesOptions
}

interface CSSModulesOptions {
    /** Scope behaviour */
    scopeBehaviour?: 'global' | 'local'
    /** Generate scoped name */
    generateScopedName?: string | ((name: string, filename: string, css: string) => string)
    /** Locals convention */
    localsConvention?: 'camelCase' | 'dashes' | 'dashesOnly'
}

interface JSONOptions {
    /** Named exports */
    namedExports?: boolean
    /** Stringify */
    stringify?: boolean
}

interface ESBuildOptions {
    /** JSX factory */
    jsxFactory?: string
    /** JSX fragment */
    jsxFragment?: string
}

interface OptimizeDepsOptions {
    /** Include */
    include?: Array<string>
    /** Exclude */
    exclude?: Array<string>
}

/**
 * Vite build paths configuration
 */
export interface ViteBuildPaths {
    /** Entry point file path (e.g., './src/index.tsx') */
    entry: string
    /** Output directory path (e.g., './dist') */
    output: string
    /** HTML template file path (e.g., './public/index.html') */
    html: string
    /** Source directory path (e.g., './src') */
    src: string
    /** Public assets directory path (optional) */
    public?: string
}

/**
 * Vite build configuration options
 */
export interface ViteBuildOptions {
    /** Build mode - 'development' or 'production' */
    mode: 'development' | 'production'
    /** Path configuration for build */
    paths: ViteBuildPaths
    /** Whether this is a development build (enables dev server, etc.) */
    isDev?: boolean
    /** Development server port number (default: 3000) */
    port?: number
    /** Enable bundle analyzer (default: false) */
    analyzer?: boolean
    /** Public path for assets (default: '/') */
    publicPath?: string
    /** Target platform for build optimization */
    platform?: NodeJS.Platform
    /** Env variables */
    env?: ViteEnvVariables
    /** React plugin options (if using React) */
    reactOptions?: ReactPluginOptions
}

/**
 * Environment variables for Vite configuration
 */
export interface ViteEnvVariables {
    /** Build mode */
    mode: 'development' | 'production'
    /** Development server port */
    port?: number
    /** Enable bundle analyzer */
    analyzer?: boolean
    /** API URL for environment configuration */
    apiUrl?: string
    /** Base URL for the application */
    baseUrl?: string
}

export interface ViteConfiguration extends UserConfig {
    /** Custom Vite configuration options */
    viteOptions?: ViteBuildOptions
}
