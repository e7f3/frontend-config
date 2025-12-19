import * as fs from 'fs'
import * as path from 'path'

import type { CachePerformance } from '../types/performance'

/**
 * Analyzes build cache performance and provides optimization recommendations.
 */
export class BuildCacheAnalyzer {
    private readonly cacheDir: string
    private cacheStats: CacheStats = {
        hits: 0,
        misses: 0,
        totalRequests: 0,
        cacheSize: 0,
        cachedModules: 0,
    }

    constructor(cacheDir: string = './node_modules/.cache') {
        this.cacheDir = cacheDir
    }

    /**
     * Analyzes current cache performance metrics.
     * @returns Cache performance data including hit rate and effectiveness score
     */
    public analyzeCachePerformance(): CachePerformance {
        this.collectCacheStats()

        const hitRate = this.cacheStats.totalRequests > 0 ? this.cacheStats.hits / this.cacheStats.totalRequests : 0

        const effectivenessScore = this.calculateCacheEffectivenessScore()
        const timeSaved = this.estimateTimeSaved()

        return {
            hitRate,
            hits: this.cacheStats.hits,
            misses: this.cacheStats.misses,
            effectivenessScore,
            timeSaved,
            cacheSize: this.cacheStats.cacheSize,
            cachedModules: this.cacheStats.cachedModules,
        }
    }

    /**
     * Generates cache optimization recommendations based on current performance.
     * @returns Optimization recommendations with priority levels
     */
    public generateCacheOptimizations(): {
        recommendations: Array<string>
        optimizations: Array<CacheOptimization>
        priority: 'high' | 'medium' | 'low'
    } {
        const recommendations: Array<string> = []
        const optimizations: Array<CacheOptimization> = []

        // Analyze hit rate
        const hitRate = this.cacheStats.totalRequests > 0 ? this.cacheStats.hits / this.cacheStats.totalRequests : 0

        if (hitRate < 0.7) {
            recommendations.push('Low cache hit rate detected. Consider optimizing cache configuration.')
            optimizations.push({
                type: 'increase-cache-size',
                description: 'Increase webpack cache size limit',
                impact: 'high',
                effort: 'low',
                estimatedImprovement: '20-30% hit rate improvement',
            })
        }

        // Analyze cache size
        if (this.cacheStats.cacheSize > 500 * 1024 * 1024) {
            // 500MB
            recommendations.push('Cache size is quite large. Consider cache cleanup.')
            optimizations.push({
                type: 'cache-cleanup',
                description: 'Implement regular cache cleanup strategy',
                impact: 'medium',
                effort: 'low',
                estimatedImprovement: '10-15% space savings',
            })
        }

        // Analyze module count
        if (this.cacheStats.cachedModules > 10000) {
            recommendations.push('High number of cached modules detected.')
            optimizations.push({
                type: 'module-analysis',
                description: 'Analyze and remove unnecessary cached modules',
                impact: 'medium',
                effort: 'medium',
                estimatedImprovement: '15-25% module reduction',
            })
        }

        // Check cache directory structure
        const cacheAnalysis = this.analyzeCacheDirectory()
        if (cacheAnalysis.orphanedFiles > 100) {
            recommendations.push('Many orphaned cache files detected. Run cache cleanup.')
            optimizations.push({
                type: 'cleanup-orphaned-files',
                description: 'Remove orphaned cache files',
                impact: 'medium',
                effort: 'low',
                estimatedImprovement: '5-10% performance improvement',
            })
        }

        return {
            recommendations,
            optimizations,
            priority: this.determinePriority(recommendations.length, optimizations.length),
        }
    }

    /**
     * Monitors cache memory usage and provides recommendations.
     * @returns Memory usage analysis with pressure level and recommendations
     */
    public monitorCacheMemoryUsage(): {
        currentUsage: number
        peakUsage: number
        memoryPressure: 'low' | 'medium' | 'high'
        recommendations: Array<string>
    } {
        const currentUsage = this.cacheStats.cacheSize
        const peakUsage = this.calculatePeakMemoryUsage()
        const memoryPressure = this.calculateMemoryPressure(currentUsage)

        const recommendations = []
        if (memoryPressure === 'high') {
            recommendations.push('Cache memory usage is high. Consider increasing cache size or implementing cleanup.')
        } else if (memoryPressure === 'medium') {
            recommendations.push('Monitor cache memory usage and consider optimization.')
        }

        return {
            currentUsage,
            peakUsage,
            memoryPressure,
            recommendations,
        }
    }

    /**
     * Compares cache performance across different environments.
     * @param environments - List of environment names to compare
     * @returns Performance comparison data with best performing environment
     */
    public compareCachePerformance(environments: Array<string>): {
        comparison: Record<string, CachePerformance>
        bestPerforming: string
        recommendations: Array<string>
    } {
        const comparison: Record<string, CachePerformance> = {}

        environments.forEach((env) => {
            const envCacheDir = path.join(this.cacheDir, env)
            if (fs.existsSync(envCacheDir)) {
                const analyzer = new BuildCacheAnalyzer(envCacheDir)
                comparison[env] = analyzer.analyzeCachePerformance()
            }
        })

        const bestPerforming = this.findBestPerformingEnvironment(comparison)
        const recommendations = this.generateEnvironmentComparisonRecommendations(comparison)

        return {
            comparison,
            bestPerforming,
            recommendations,
        }
    }

    // Private helper methods

    private collectCacheStats(): void {
        this.cacheStats = {
            hits: 0,
            misses: 0,
            totalRequests: 0,
            cacheSize: 0,
            cachedModules: 0,
        }

        if (!fs.existsSync(this.cacheDir)) {
            return
        }

        // Calculate cache directory size
        this.cacheStats.cacheSize = this.calculateDirectorySize(this.cacheDir)

        // Count cached modules
        this.cacheStats.cachedModules = this.countCacheFiles(this.cacheDir)

        // Estimate hits/misses based on directory structure and timestamps
        this.estimateCacheActivity()
    }

    private calculateDirectorySize(dirPath: string): number {
        let totalSize = 0
        const files = fs.readdirSync(dirPath)

        files.forEach((file) => {
            const filePath = path.join(dirPath, file)
            const stats = fs.statSync(filePath)

            if (stats.isDirectory()) {
                totalSize += this.calculateDirectorySize(filePath)
            } else {
                totalSize += stats.size
            }
        })

        return totalSize
    }

    private countCacheFiles(dirPath: string): number {
        let count = 0
        const files = fs.readdirSync(dirPath)

        files.forEach((file) => {
            const filePath = path.join(dirPath, file)
            const stats = fs.statSync(filePath)

            if (stats.isDirectory()) {
                count += this.countCacheFiles(filePath)
            } else {
                count++
            }
        })

        return count
    }

    private estimateCacheActivity(): void {
        // This is a simplified estimation
        // In a real implementation, you would track actual cache hits/misses
        const cacheFiles = this.countCacheFiles(this.cacheDir)

        // Estimate based on cache size and file count
        this.cacheStats.totalRequests = Math.max(cacheFiles * 2, 100)
        this.cacheStats.hits = Math.floor(this.cacheStats.totalRequests * 0.8) // 80% hit rate assumption
        this.cacheStats.misses = this.cacheStats.totalRequests - this.cacheStats.hits
    }

    private calculateCacheEffectivenessScore(): number {
        const hitRate = this.cacheStats.totalRequests > 0 ? this.cacheStats.hits / this.cacheStats.totalRequests : 0

        const sizeEfficiency =
            this.cacheStats.cacheSize > 0 ? Math.min(100, (this.cacheStats.cachedModules / (this.cacheStats.cacheSize / 1024)) * 10) : 0

        return Math.round(hitRate * 70 + sizeEfficiency * 0.3)
    }

    private estimateTimeSaved(): number {
        // Estimate time saved based on cache hit rate
        // const _hitRate = this.cacheStats.totalRequests > 0 ? this.cacheStats.hits / this.cacheStats.totalRequests : 0

        // Assume each cache hit saves ~500ms and each cache miss takes ~2000ms
        const estimatedBuildTime = this.cacheStats.totalRequests * 2000
        const actualTimeWithCache = this.cacheStats.hits * 500 + this.cacheStats.misses * 2000

        return Math.max(0, estimatedBuildTime - actualTimeWithCache)
    }

    private analyzeCacheDirectory(): {
        fileCount: number
        directoryCount: number
        totalSize: number
        oldestFile: Date | null
        newestFile: Date | null
        orphanedFiles: number
    } {
        let fileCount = 0
        let directoryCount = 0
        let totalSize = 0
        let oldestFile: Date | null = null
        let newestFile: Date | null = null
        const fileAges: Array<Date> = []

        this.walkDirectory(
            this.cacheDir,
            (_filePath, stats) => {
                fileCount++
                totalSize += stats.size
                fileAges.push(stats.mtime)

                if (!oldestFile || stats.mtime < oldestFile) {
                    oldestFile = stats.mtime
                }
                if (!newestFile || stats.mtime > newestFile) {
                    newestFile = stats.mtime
                }
            },
            () => {
                directoryCount++
            }
        )

        // Estimate orphaned files (files not accessed recently)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const orphanedFiles = fileAges.filter((date) => date < oneWeekAgo).length

        return {
            fileCount,
            directoryCount,
            totalSize,
            oldestFile,
            newestFile,
            orphanedFiles,
        }
    }

    private walkDirectory(dirPath: string, onFile: (filePath: string, stats: fs.Stats) => void, onDirectory: () => void): void {
        if (!fs.existsSync(dirPath)) return

        const items = fs.readdirSync(dirPath)

        items.forEach((item) => {
            const itemPath = path.join(dirPath, item)
            const stats = fs.statSync(itemPath)

            if (stats.isDirectory()) {
                onDirectory()
                this.walkDirectory(itemPath, onFile, onDirectory)
            } else {
                onFile(itemPath, stats)
            }
        })
    }

    private calculatePeakMemoryUsage(): number {
        // Estimate peak memory usage based on cache size and file count
        // const _avgModuleSize = this.cacheStats.cachedModules > 0 ? this.cacheStats.cacheSize / this.cacheStats.cachedModules : 0

        // Assume peak usage is 1.5x current usage
        return this.cacheStats.cacheSize * 1.5
    }

    private calculateMemoryPressure(cacheSize: number): 'low' | 'medium' | 'high' {
        const cacheSizeMB = cacheSize / (1024 * 1024)

        if (cacheSizeMB < 100) return 'low'
        if (cacheSizeMB < 500) return 'medium'
        return 'high'
    }

    private determinePriority(recommendationCount: number, optimizationCount: number): 'high' | 'medium' | 'low' {
        if (recommendationCount >= 3 || optimizationCount >= 3) return 'high'
        if (recommendationCount >= 2 || optimizationCount >= 2) return 'medium'
        return 'low'
    }

    private findBestPerformingEnvironment(performance: Record<string, CachePerformance>): string {
        let bestEnv = ''
        let bestScore = -1

        Object.entries(performance).forEach(([env, perf]) => {
            const score = perf.effectivenessScore + perf.hitRate * 100
            if (score > bestScore) {
                bestScore = score
                bestEnv = env
            }
        })

        return bestEnv
    }

    private generateEnvironmentComparisonRecommendations(performance: Record<string, CachePerformance>): Array<string> {
        const recommendations: Array<string> = []
        const scores = Object.values(performance).map((perf) => perf.effectivenessScore)
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

        Object.entries(performance).forEach(([env, perf]) => {
            if (perf.effectivenessScore < avgScore * 0.8) {
                recommendations.push(
                    `Environment "${env}" has low cache effectiveness (${perf.effectivenessScore}). Consider cache optimization.`
                )
            }
        })

        return recommendations
    }
}

interface CacheStats {
    hits: number
    misses: number
    totalRequests: number
    cacheSize: number
    cachedModules: number
}

interface CacheOptimization {
    type: 'increase-cache-size' | 'cache-cleanup' | 'module-analysis' | 'cleanup-orphaned-files'
    description: string
    impact: 'high' | 'medium' | 'low'
    effort: 'high' | 'medium' | 'low'
    estimatedImprovement: string
}
