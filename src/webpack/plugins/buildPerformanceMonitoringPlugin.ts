import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'

import type {
    BuildPerformanceMetrics,
    BundleAnalysis,
    ModuleAnalysis,
    ChunkAnalysis,
    AssetAnalysis,
    PerformancePluginOptions,
    PerformanceHint,
} from '../types/performance'

/**
 * Webpack performance monitoring plugin.
 */
export class PerformanceMonitoringPlugin {
    private readonly options: PerformancePluginOptions
    private readonly startTime: number
    private readonly metrics: Partial<BuildPerformanceMetrics> = {}
    // private _compilationStats: webpack.Stats | null = null

    constructor(options: Partial<PerformancePluginOptions> = {}) {
        this.options = {
            enableTimings: true,
            enableMemoryProfiling: true,
            enableCacheAnalysis: true,
            outputFormat: 'json',
            outputDir: './performance-reports',
            enableRealTimeReporting: false,
            ...options,
        }
        this.startTime = Date.now()
    }

    /**
     * Apply the plugin to webpack compiler
     */
    public apply(compiler: webpack.Compiler): void {
        // Ensure output directory exists
        if (!fs.existsSync(this.options.outputDir)) {
            fs.mkdirSync(this.options.outputDir, { recursive: true })
        }

        // Hook into compilation process
        compiler.hooks.compilation.tap('PerformanceMonitoringPlugin', (compilation) => {
            this.onCompilation(compilation)
        })

        // Hook into emit phase
        compiler.hooks.emit.tapAsync('PerformanceMonitoringPlugin', (compilation, callback) => {
            this.onEmit(compilation)
                .then(() => callback())
                .catch((error) => {
                    console.error('Error in emit phase:', error)
                    callback(error)
                })
        })

        // Hook into after emit phase
        compiler.hooks.afterEmit.tapAsync('PerformanceMonitoringPlugin', (compilation, callback) => {
            this.onAfterEmit(compilation)
                .then(() => callback())
                .catch((error) => {
                    console.error('Error in after emit phase:', error)
                    callback(error)
                })
        })

        // Hook into done phase for final reporting
        compiler.hooks.done.tap('PerformanceMonitoringPlugin', (stats) => {
            this.onDone(stats)
        })

        // Hook into failed phase for error reporting
        compiler.hooks.failed.tap('PerformanceMonitoringPlugin', (error) => {
            this.onFailed(error)
        })
    }

    /**
     * Handles compilation start.
     * @param compilation - Webpack compilation instance
     */
    private onCompilation(compilation: webpack.Compilation): void {
        this.metrics.compilationTime = Date.now()
        this.metrics.moduleCount = compilation.modules.size
        this.metrics.assetCount = compilation.assetsInfo ? compilation.assetsInfo.size : 0

        // Collect initial memory usage
        if (this.options.enableMemoryProfiling) {
            this.metrics.peakMemoryUsage = this.getMemoryUsage()
        }

        // Hook into optimization phases
        compilation.hooks.optimizeModules.tap('PerformanceMonitoringPlugin', () => {
            this.recordTiming('optimization')
        })

        compilation.hooks.optimizeChunks.tap('PerformanceMonitoringPlugin', () => {
            this.recordTiming('chunkOptimization')
        })
    }

    /**
     * Handles emit phase.
     * @param compilation - Webpack compilation instance
     */
    private async onEmit(compilation: webpack.Compilation): Promise<void> {
        try {
            this.metrics.emitTime = Date.now() - (this.metrics.compilationTime || this.startTime)

            // Collect asset information
            if (compilation.assets) {
                this.metrics.bundleAnalysis = await this.analyzeBundle(compilation.assets, compilation)
            }

            // Update memory usage
            if (this.options.enableMemoryProfiling) {
                const currentMemory = this.getMemoryUsage()
                if (!this.metrics.peakMemoryUsage || currentMemory > this.metrics.peakMemoryUsage) {
                    this.metrics.peakMemoryUsage = currentMemory
                }
            }
        } catch (error) {
            console.error('Error in onEmit:', error)
            throw error
        }
    }

    /**
     * Handles after emit phase.
     * @param compilation - Webpack compilation instance
     */
    private async onAfterEmit(compilation: webpack.Compilation): Promise<void> {
        try {
            this.metrics.chunkCount = compilation.chunks.size

            // Analyze chunks
            if (compilation.assets) {
                this.metrics.bundleAnalysis = await this.analyzeBundle(compilation.assets, compilation)
            }
        } catch (error) {
            console.error('Error in onAfterEmit:', error)
            throw error
        }
    }

    /**
     * Handles compilation done.
     * @param stats - Webpack compilation stats
     */
    private onDone(stats: webpack.Stats): void {
        this.metrics.totalBuildTime = Date.now() - this.startTime
        this.metrics.webpackVersion = stats.compilation.compiler.webpack.version
        this.metrics.nodeVersion = process.version
        this.metrics.timestamp = new Date().toISOString()
        this.metrics.environment = stats.compilation.compiler.options.mode || 'unknown'

        // Store compilation stats for detailed analysis
        // Store compilation stats for detailed analysis
        // this._compilationStats = stats

        // Generate performance hints
        this.metrics.performanceHints = this.generatePerformanceHints()

        // Generate final report
        this.generateReport()
    }

    /**
     * Handles compilation failure.
     * @param error - Compilation error
     */
    private onFailed(error: Error): void {
        try {
            const failureReport = {
                timestamp: new Date().toISOString(),
                buildTime: Date.now() - this.startTime,
                error: error.message,
                stack: error.stack,
            }

            const reportPath = path.join(this.options.outputDir, `build-failure-${Date.now()}.json`)
            fs.writeFileSync(reportPath, JSON.stringify(failureReport, null, 2))
        } catch (writeError) {
            console.error('Failed to write failure report:', writeError)
            console.error('Original error:', error)
        }
    }

    /**
     * Analyzes bundle composition and sizes.
     * @param assets - Webpack assets
     * @param compilation - Webpack compilation instance
     * @returns Bundle analysis data
     */
    private async analyzeBundle(assets: Record<string, webpack.sources.Source>, compilation: webpack.Compilation): Promise<BundleAnalysis> {
        const assetEntries = Object.entries(assets).filter(([name]) => !name.startsWith('/') && !name.includes('?:'))

        const assetAnalysis: Array<AssetAnalysis> = []
        let totalSize = 0
        let vendorSize = 0
        let appSize = 0
        let commonSize = 0

        for (const [name, asset] of assetEntries) {
            const size = asset.size()
            const gzippedSize = await this.estimateGzippedSize(name, size)
            const percentage = (size / assetEntries.reduce((sum, [, a]) => sum + a.size(), 0)) * 100

            const analysis: AssetAnalysis = {
                name,
                type: this.getAssetType(name),
                size,
                gzippedSize,
                percentage,
                exceedsBudget: this.checkBudget(name, size),
            }

            assetAnalysis.push(analysis)
            totalSize += size

            // Categorize by bundle type
            if (name.includes('vendor') || name.includes('node_modules')) {
                vendorSize += size
            } else if (name.includes('common')) {
                commonSize += size
            } else if (name.includes('.js') || name.includes('.css')) {
                appSize += size
            }
        }

        // Analyze modules
        const moduleAnalysis: Array<ModuleAnalysis> = this.analyzeModules(compilation)

        // Analyze chunks
        const chunkAnalysis: Array<ChunkAnalysis> = this.analyzeChunks(compilation)

        return {
            totalSize,
            gzippedSize: assetAnalysis.reduce((sum, asset) => sum + asset.gzippedSize, 0),
            assets: assetAnalysis.sort((a, b) => b.size - a.size),
            modules: moduleAnalysis.sort((a, b) => b.size - a.size).slice(0, 50), // Top 50 modules
            chunks: chunkAnalysis,
            vendorSize,
            appSize,
            commonSize,
        }
    }

    /**
     * Analyzes modules in compilation.
     * @param compilation - Webpack compilation instance
     * @returns Array of module analysis data
     */
    private analyzeModules(compilation: webpack.Compilation): Array<ModuleAnalysis> {
        const modules: Array<ModuleAnalysis> = []

        compilation.modules.forEach((module) => {
            const moduleAnalysis: ModuleAnalysis = {
                name: module.identifier() || 'unknown',
                path: (module as webpack.NormalModule).resource || 'unknown',
                size: this.estimateModuleSize(module),
                type: this.getModuleType(module),
                isVendor: (module as webpack.NormalModule).resource?.includes('node_modules') || false,
                category: this.categorizeModule(module),
            }
            modules.push(moduleAnalysis)
        })

        return modules
    }

    /**
     * Analyzes chunks in compilation.
     * @param compilation - Webpack compilation instance
     * @returns Array of chunk analysis data
     */
    private analyzeChunks(compilation: webpack.Compilation): Array<ChunkAnalysis> {
        const chunks: Array<ChunkAnalysis> = []

        compilation.chunks.forEach((chunk) => {
            const files = Array.from(chunk.files)
            const chunkSize = files.reduce((total, file) => {
                const asset = compilation.assets?.[file]
                return total + (asset ? asset.size() : 0)
            }, 0)

            // Type-safe access to modules property
            // const chunkWithModules = chunk as unknown as Record<string, unknown>
            // const _modules = chunkWithModules.modules as { size?: number } | undefined

            const chunkAnalysis: ChunkAnalysis = {
                name: chunk.name || 'anonymous',
                size: chunkSize,
                gzippedSize: 0, // Would need compression calculation
                moduleCount: this.getChunkModuleCount(chunk),
                type: this.getChunkType(chunk),
                isDuplicated: this.isChunkDuplicated(chunk, compilation),
            }
            chunks.push(chunkAnalysis)
        })

        return chunks
    }

    /**
     * Generates performance hints and recommendations.
     * @returns Array of performance hints
     */
    private generatePerformanceHints(): Array<PerformanceHint> {
        const hints: Array<PerformanceHint> = []

        // Check bundle size
        if (this.metrics.bundleAnalysis) {
            const { totalSize } = this.metrics.bundleAnalysis
            const maxBundleSize = 1024 * 1024 // 1MB

            if (totalSize > maxBundleSize) {
                hints.push({
                    type: 'asset-size' as const,
                    severity: 'warning' as const,
                    message: `Bundle size (${this.formatSize(totalSize)}) exceeds recommended limit (${this.formatSize(maxBundleSize)})`,
                    recommendation: 'Consider code splitting or lazy loading to reduce bundle size',
                    actual: totalSize,
                    budget: maxBundleSize,
                })
            }
        }

        // Check build time
        if (this.metrics.totalBuildTime) {
            const maxBuildTime = 30000 // 30 seconds
            if (this.metrics.totalBuildTime > maxBuildTime) {
                hints.push({
                    type: 'module-size' as const,
                    severity: 'warning' as const,
                    message: `Build time (${this.formatTime(this.metrics.totalBuildTime)}) exceeds recommended limit (${this.formatTime(maxBuildTime)})`,
                    recommendation: 'Consider optimizing build configuration or reducing dependencies',
                    actual: this.metrics.totalBuildTime,
                    budget: maxBuildTime,
                })
            }
        }

        // Check memory usage
        if (this.metrics.peakMemoryUsage) {
            const maxMemory = 1024 // 1GB
            if (this.metrics.peakMemoryUsage > maxMemory) {
                hints.push({
                    type: 'chunk-size' as const,
                    severity: 'error' as const,
                    message: `Memory usage (${this.formatSize(this.metrics.peakMemoryUsage * 1024 * 1024)}) exceeds recommended limit (${this.formatSize(maxMemory * 1024 * 1024)})`,
                    recommendation: 'Consider increasing memory limits or optimizing memory usage',
                    actual: this.metrics.peakMemoryUsage,
                    budget: maxMemory,
                })
            }
        }

        return hints
    }

    /**
     * Generates performance report.
     */
    private generateReport(): void {
        try {
            const report = {
                metrics: this.metrics,
                timestamp: new Date().toISOString(),
                buildId: this.generateBuildId(),
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const reportPath = path.join(this.options.outputDir, `performance-report-${timestamp}.json`)

            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

            // Generate HTML report if requested
            if (this.options.outputFormat === 'html' || this.options.outputFormat === 'all') {
                this.generateHtmlReport(report, reportPath.replace('.json', '.html'))
            }

            // Console output if requested
            if (this.options.outputFormat === 'console' || this.options.outputFormat === 'all') {
                this.outputToConsole(report)
            }

            // Real-time reporting
            if (this.options.enableRealTimeReporting) {
                this.outputToRealTime(report)
            }
        } catch (error) {
            console.error('Failed to generate performance report:', error)
        }
    }

    /**
     * Generates HTML report.
     * @param report - Performance report data
     * @param outputPath - Output path for HTML report
     */
    private generateHtmlReport(
        report: { metrics: Partial<BuildPerformanceMetrics>; timestamp: string; buildId: string },
        outputPath: string
    ): void {
        try {
            const html = this.createHtmlTemplate(report)
            fs.writeFileSync(outputPath, html)
        } catch (error) {
            console.error('Failed to generate HTML report:', error)
        }
    }

    /**
     * Creates HTML template for performance report.
     * @param report - Performance report data
     * @returns HTML template string
     */
    private createHtmlTemplate(report: { metrics: Partial<BuildPerformanceMetrics>; timestamp: string; buildId: string }): string {
        const { metrics } = report
        const { bundleAnalysis } = metrics

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .good { background-color: #d4edda; }
        .warning { background-color: #fff3cd; }
        .error { background-color: #f8d7da; }
        .score { font-size: 2em; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .progress-bar { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background-color: #4CAF50; }
    </style>
</head>
<body>
    <h1>Build Performance Report</h1>
    
    <div class="metric">
        <h2>Build Summary</h2>
        <p><strong>Build Time:</strong> ${this.formatTime(metrics.totalBuildTime || 0)}</p>
        <p><strong>Memory Usage:</strong> ${this.formatSize((metrics.peakMemoryUsage || 0) * 1024 * 1024)}</p>
        <p><strong>Modules:</strong> ${metrics.moduleCount}</p>
        <p><strong>Assets:</strong> ${metrics.assetCount}</p>
        <p><strong>Environment:</strong> ${metrics.environment}</p>
    </div>

    ${
        bundleAnalysis
            ? `
    <div class="metric">
        <h2>Bundle Analysis</h2>
        <p><strong>Total Size:</strong> ${this.formatSize(bundleAnalysis.totalSize)}</p>
        <p><strong>Gzipped Size:</strong> ${this.formatSize(bundleAnalysis.gzippedSize)}</p>
        <p><strong>Vendor Size:</strong> ${this.formatSize(bundleAnalysis.vendorSize)}</p>
        <p><strong>App Size:</strong> ${this.formatSize(bundleAnalysis.appSize)}</p>
        
        <h3>Top Assets</h3>
        <table>
            <thead><tr><th>Asset</th><th>Size</th><th>% of Total</th></tr></thead>
            <tbody>
                ${bundleAnalysis.assets
                    .slice(0, 10)
                    .map(
                        (asset: AssetAnalysis) => `
                    <tr>
                        <td>${asset.name}</td>
                        <td>${this.formatSize(asset.size)}</td>
                        <td>${asset.percentage.toFixed(1)}%</td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        </table>
    </div>
    `
            : ''
    }

    ${
        metrics.performanceHints && metrics.performanceHints.length > 0
            ? `
    <div class="metric">
        <h2>Performance Hints</h2>
        ${metrics.performanceHints
            .map(
                (hint: any) => `
            <div class="${hint.severity}">
                <h4>${hint.type}</h4>
                <p>${hint.message}</p>
                ${hint.recommendation ? `<p><strong>Recommendation:</strong> ${hint.recommendation}</p>` : ''}
            </div>
        `
            )
            .join('')}
    </div>
    `
            : ''
    }
</body>
</html>
        `
    }

    /**
     * Outputs report to console.
     * @param report - Performance report data
     */
    private outputToConsole(report: { metrics: Partial<BuildPerformanceMetrics>; timestamp: string; buildId: string }): void {
        const { metrics } = report

        console.log('\n📊 Build Performance Report')
        console.log('==========================')
        console.log(`⏱️  Build Time: ${this.formatTime(metrics.totalBuildTime || 0)}`)
        console.log(`💾 Memory Usage: ${this.formatSize((metrics.peakMemoryUsage || 0) * 1024 * 1024)}`)
        console.log(`📦 Modules: ${metrics.moduleCount}`)
        console.log(`📁 Assets: ${metrics.assetCount}`)

        if (metrics.bundleAnalysis) {
            console.log(`📊 Bundle Size: ${this.formatSize(metrics.bundleAnalysis.totalSize)}`)
            console.log(`🗜️  Gzipped Size: ${this.formatSize(metrics.bundleAnalysis.gzippedSize)}`)
        }

        if (metrics.performanceHints && metrics.performanceHints.length > 0) {
            console.log('\n⚠️  Performance Hints:')
            metrics.performanceHints.forEach((hint: any) => {
                console.log(`   ${hint.severity.toUpperCase()}: ${hint.message}`)
                if (hint.recommendation) {
                    console.log(`   💡 ${hint.recommendation}`)
                }
            })
        }

        console.log(`\n${'='.repeat(50)}\n`)
    }

    /**
     * Outputs to real-time monitoring system.
     * @param report - Performance report data
     */
    private outputToRealTime(report: { metrics: Partial<BuildPerformanceMetrics>; timestamp: string; buildId: string }): void {
        // Implementation would depend on the real-time monitoring system
        // This could be WebSocket, HTTP endpoint, or logging system
        console.log('📡 Real-time performance data:', JSON.stringify(report))
    }

    // Utility methods
    private recordTiming(phase: string): void {
        if (!this.options.enableTimings) return

        const currentTime = Date.now()
        const timingKey = `${phase}Time`

        // Store the timing for this phase
        switch (phase) {
            case 'optimization':
                this.metrics.optimizationTime = currentTime - (this.metrics.compilationTime || this.startTime)
                break
            case 'chunkOptimization':
                this.metrics.chunkGenerationTime = currentTime - (this.metrics.compilationTime || this.startTime)
                break
            case 'moduleResolution':
                this.metrics.moduleResolutionTime = currentTime - (this.metrics.compilationTime || this.startTime)
                break
            default:
                // Store custom timing in a generic way
                if (timingKey in this.metrics) {
                    ;(this.metrics as Record<string, unknown>)[timingKey] = currentTime - (this.metrics.compilationTime || this.startTime)
                }
        }
    }

    private getMemoryUsage(): number {
        const usage = process.memoryUsage()
        return Math.max(usage.heapUsed, usage.external) / (1024 * 1024) // Convert to MB
    }

    private estimateGzippedSize(assetName: string, originalSize: number): number {
        // More accurate estimation based on file type
        const ext = path.extname(assetName).toLowerCase()

        // Different compression ratios for different file types
        const compressionRatios: Record<string, number> = {
            '.js': 0.25, // JavaScript compresses well
            '.css': 0.2, // CSS compresses very well
            '.json': 0.15, // JSON compresses extremely well
            '.html': 0.25, // HTML compresses well
            '.txt': 0.3, // Text files compress moderately
            '.svg': 0.4, // SVG compresses less due to XML structure
            '.woff': 0.98, // Font files are already compressed
            '.woff2': 0.99, // WOFF2 is already highly compressed
            '.png': 0.99, // PNG is already compressed
            '.jpg': 0.99, // JPEG is already compressed
            '.jpeg': 0.99, // JPEG is already compressed
            '.gif': 0.99, // GIF is already compressed
        }

        // Use file type specific ratio or default to 0.3
        const ratio = compressionRatios[ext] || 0.3

        // Apply minimum size to avoid unrealistic estimates for very small files
        const minSize = Math.min(originalSize, 100)
        const estimatedSize = Math.floor(originalSize * ratio)

        return Math.max(estimatedSize, minSize)
    }

    private checkBudget(_assetName: string, size: number): boolean {
        // Simple budget checking - could be enhanced with actual budget configuration
        const maxAssetSize = 512 * 1024 // 512KB
        return size > maxAssetSize
    }

    private getAssetType(fileName: string): string {
        const ext = path.extname(fileName).toLowerCase()
        const typeMap: Record<string, string> = {
            '.js': 'javascript',
            '.css': 'stylesheet',
            '.png': 'image',
            '.jpg': 'image',
            '.jpeg': 'image',
            '.gif': 'image',
            '.svg': 'image',
            '.woff': 'font',
            '.woff2': 'font',
            '.ttf': 'font',
            '.eot': 'font',
        }
        return typeMap[ext] || 'unknown'
    }

    private estimateModuleSize(module: webpack.Module): number {
        // Try to get actual module size from webpack
        const normalModule = module as webpack.NormalModule

        // Check if module has size information
        if (normalModule.size && typeof normalModule.size === 'function') {
            try {
                return normalModule.size()
            } catch (error) {
                // Size calculation failed, continue with other methods
            }
        }

        // Try to get size from module source using a safer approach
        try {
            // Access the original source if available
            const moduleWithSource = module as unknown as Record<string, unknown>
            const originalSource = moduleWithSource._originalSource || moduleWithSource.originalSource

            if (originalSource) {
                if (typeof originalSource === 'object' && originalSource !== null && 'size' in originalSource) {
                    const sourceWithSize = originalSource as { size: () => number }
                    if (typeof sourceWithSize.size === 'function') {
                        return sourceWithSize.size()
                    }
                }
                if (typeof originalSource === 'string') {
                    return originalSource.length
                }
            }
        } catch (error) {
            // Source access failed, continue with other methods
        }

        // Try to get size from module identifier (file path)
        if (normalModule.resource) {
            try {
                const stats = fs.statSync(normalModule.resource)
                return stats.size
            } catch (error) {
                // File might not exist or be inaccessible
            }
        }

        // Fallback to estimation based on module type and identifier
        const identifier = module.identifier() || ''
        const moduleType = this.getModuleType(module)

        // Base sizes by module type
        const baseSizes: Record<string, number> = {
            javascript: 2000,
            typescript: 2500,
            stylesheet: 1500,
            json: 500,
            image: 10000,
            font: 50000,
            unknown: 1000,
        }

        let estimatedSize = baseSizes[moduleType] || 1000

        // Adjust based on identifier characteristics
        if (identifier.includes('node_modules')) {
            // Vendor modules are typically larger
            estimatedSize *= 1.5
        }

        if (identifier.includes('.min.') || identifier.includes('.bundle.')) {
            // Minified or bundled files
            estimatedSize *= 0.7
        }

        return estimatedSize
    }

    private getModuleType(module: webpack.Module): string {
        const normalModule = module as webpack.NormalModule
        const resource = normalModule?.resource

        if (!resource) return 'unknown'

        if (resource.endsWith('.css')) return 'stylesheet'
        if (resource.endsWith('.js')) return 'javascript'
        if (resource.endsWith('.ts')) return 'typescript'
        if (resource.endsWith('.tsx')) return 'typescript'
        if (resource.endsWith('.json')) return 'json'
        return 'unknown'
    }

    private categorizeModule(module: webpack.Module): 'vendor' | 'app' | 'shared' | 'other' {
        const normalModule = module as webpack.NormalModule
        const resource = normalModule?.resource

        if (!resource) return 'other'

        if (resource.includes('node_modules')) return 'vendor'
        if (resource.includes('src/')) return 'app'
        if (resource.includes('shared/')) return 'shared'
        return 'other'
    }

    private getChunkType(chunk: webpack.Chunk): 'initial' | 'async' | 'all' | 'single' {
        if (chunk.hasRuntime()) return 'initial'
        return 'async'
    }

    private getChunkModuleCount(chunk: webpack.Chunk): number {
        // Try to get module count from modulesIterable first
        if (chunk.modulesIterable) {
            let count = 0
            for (const _module of Array.from(chunk.modulesIterable)) {
                count++
            }
            return count
        }

        // Fallback to accessing modules property directly
        try {
            const chunkWithModules = chunk as unknown as Record<string, unknown>
            const modules = chunkWithModules.modules as Iterable<webpack.Module> | { size?: number } | undefined

            if (modules && typeof modules === 'object' && 'size' in modules) {
                return modules.size || 0
            }

            if (modules) {
                let count = 0
                for (const _module of Array.from(modules as Iterable<webpack.Module>)) {
                    count++
                }
                return count
            }
        } catch (error) {
            // Access failed, return default
        }

        return 0
    }

    private isChunkDuplicated(chunk: webpack.Chunk, compilation: webpack.Compilation): boolean {
        // Check if this chunk's modules are also included in other chunks
        const chunkModules = new Set<string>()

        // Collect all modules in this chunk
        if (chunk.modulesIterable) {
            for (const module of Array.from(chunk.modulesIterable)) {
                chunkModules.add(module.identifier())
            }
        } else {
            // Type-safe access to modules property
            const chunkWithModules = chunk as unknown as Record<string, unknown>
            const modules = chunkWithModules.modules as Iterable<webpack.Module> | undefined

            if (modules) {
                for (const module of Array.from(modules)) {
                    chunkModules.add(module.identifier())
                }
            }
        }

        // If no modules found, can't determine duplication
        if (chunkModules.size === 0) {
            return false
        }

        // Check other chunks for overlapping modules
        let duplicateCount = 0
        let totalChecks = 0

        for (const otherChunk of Array.from(compilation.chunks)) {
            if (otherChunk === chunk) continue

            const otherChunkModules = new Set<string>()

            // Collect modules in other chunk
            if (otherChunk.modulesIterable) {
                for (const module of Array.from(otherChunk.modulesIterable)) {
                    otherChunkModules.add(module.identifier())
                }
            } else {
                // Type-safe access to modules property
                const otherChunkWithModules = otherChunk as unknown as Record<string, unknown>
                const modules = otherChunkWithModules.modules as Iterable<webpack.Module> | undefined

                if (modules) {
                    for (const module of Array.from(modules)) {
                        otherChunkModules.add(module.identifier())
                    }
                }
            }

            // Skip empty chunks
            if (otherChunkModules.size === 0) continue

            // Calculate overlap
            let overlapCount = 0
            for (const moduleId of Array.from(chunkModules)) {
                if (otherChunkModules.has(moduleId)) {
                    overlapCount++
                }
            }

            // If significant overlap (more than 50%), consider it duplicated
            const overlapPercentage = overlapCount / chunkModules.size
            if (overlapPercentage > 0.5) {
                duplicateCount++
            }

            totalChecks++
        }

        // If this chunk overlaps significantly with multiple other chunks, it's likely duplicated
        return totalChecks > 0 && duplicateCount / totalChecks > 0.3
    }

    private formatSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`
    }

    private formatTime(milliseconds: number): string {
        if (milliseconds < 1000) {
            return `${milliseconds}ms`
        }
        return `${(milliseconds / 1000).toFixed(1)}s`
    }

    private generateBuildId(): string {
        return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
}
