import type { 
    BuildPerformanceMetrics, 
    BuildHealthScore, 
    PerformanceRegression, 
    PerformanceBudget,
    HistoricalPerformanceData,
    AssetOptimizationRecommendation, 
} from '../types/performance'

/**
 * Analyzes build performance metrics and generates health scores with optimization recommendations.
 */
export class BuildHealthScoring {
    private readonly budgets: PerformanceBudget

    constructor(budgets: PerformanceBudget = {}) {
        this.budgets = {
            bundleSize: budgets.bundleSize || 1024 * 1024, // 1MB default
            gzippedSize: budgets.gzippedSize || 300 * 1024, // 300KB default
            buildTime: budgets.buildTime || 30000, // 30s default
            memoryUsage: budgets.memoryUsage || 1024, // 1GB default
            moduleCount: budgets.moduleCount || 1000,
            assetCount: budgets.assetCount || 100,
            chunkCount: budgets.chunkCount || 20,
            performanceScore: budgets.performanceScore || 80,
            ...budgets,
        }
    }

    /**
     * Calculates comprehensive build health score based on performance metrics.
     * @param metrics - Build performance metrics to analyze
     * @returns Overall health score with individual component scores and recommendations
     */
    public calculateHealthScore(metrics: BuildPerformanceMetrics): BuildHealthScore {
        // Calculate individual scores
        const buildTimeScore = this.calculateBuildTimeScore(metrics.totalBuildTime)
        const bundleSizeScore = this.calculateBundleSizeScore(metrics.bundleAnalysis)
        const performanceScore = this.calculatePerformanceScore(metrics)
        const cacheScore = this.calculateCacheScore(metrics)
        const memoryScore = this.calculateMemoryScore(metrics.peakMemoryUsage)

        // Calculate weighted overall score
        const overallScore = Math.round(
            buildTimeScore * 0.25 +
            bundleSizeScore * 0.25 +
            performanceScore * 0.2 +
            cacheScore * 0.15 +
            memoryScore * 0.15,
        )

        // Generate grade and status
        const { grade, status } = this.generateGradeAndStatus(overallScore)

        // Generate recommendations
        const recommendations = this.generateRecommendations({
            buildTimeScore,
            bundleSizeScore,
            performanceScore,
            cacheScore,
            memoryScore,
            metrics,
        })

        return {
            overallScore,
            buildTimeScore,
            bundleSizeScore,
            performanceScore,
            cacheScore,
            memoryScore,
            grade,
            status,
            recommendations,
        }
    }

    /**
     * Detects performance regressions compared to historical data.
     * @param currentMetrics - Current build performance metrics
     * @param historicalData - Array of historical performance data
     * @returns Array of detected performance regressions
     */
    public detectRegressions(
        currentMetrics: BuildPerformanceMetrics,
        historicalData: Array<HistoricalPerformanceData>,
    ): Array<PerformanceRegression> {
        const regressions: Array<PerformanceRegression> = []

        if (historicalData.length === 0) {
            return regressions
        }

        // Use the average of recent builds as baseline
        const recentBuilds = historicalData.slice(-10) // Last 10 builds
        const baseline = this.calculateBaseline(recentBuilds)

        // Check build time regression
        if (baseline.totalBuildTime) {
            const buildTimeRegression = this.checkRegression(
                currentMetrics.totalBuildTime,
                baseline.totalBuildTime,
                'build-time',
                15, // 15% threshold
            )
            if (buildTimeRegression) {
                regressions.push(buildTimeRegression)
            }
        }

        // Check bundle size regression
        if (currentMetrics.bundleAnalysis && baseline.bundleAnalysis) {
            const sizeRegression = this.checkRegression(
                currentMetrics.bundleAnalysis.totalSize,
                baseline.bundleAnalysis.totalSize,
                'bundle-size',
                10, // 10% threshold
            )
            if (sizeRegression) {
                regressions.push(sizeRegression)
            }
        }

        // Check memory usage regression
        if (baseline.peakMemoryUsage) {
            const memoryRegression = this.checkRegression(
                currentMetrics.peakMemoryUsage,
                baseline.peakMemoryUsage,
                'memory',
                20, // 20% threshold
            )
            if (memoryRegression) {
                regressions.push(memoryRegression)
            }
        }

        return regressions
    }

    /**
     * Generates optimization recommendations based on build metrics.
     * @param metrics - Build performance metrics to analyze
     * @returns Array of optimization recommendations with priority levels
     */
    public generateOptimizationRecommendations(
        metrics: BuildPerformanceMetrics,
    ): Array<AssetOptimizationRecommendation> {
        const recommendations: Array<AssetOptimizationRecommendation> = []

        if (!metrics.bundleAnalysis) {
            return recommendations
        }

        const { assets, modules, vendorSize, appSize, totalSize } = metrics.bundleAnalysis

        // Large bundle recommendations
        if (totalSize > this.budgets.bundleSize!) {
            recommendations.push({
                assetName: 'main-bundle',
                currentSize: totalSize,
                optimizedSize: Math.floor(totalSize * 0.7), // 30% reduction target
                savings: totalSize - Math.floor(totalSize * 0.7),
                type: 'split',
                priority: 'high',
                description: 'Bundle size exceeds budget. Implement code splitting to reduce main bundle size.',
                difficulty: 'medium',
                implementationTime: '2-4 hours',
            })
        }

        // Large vendor bundle recommendations
        if (vendorSize > totalSize * 0.4) {
            recommendations.push({
                assetName: 'vendor-bundle',
                currentSize: vendorSize,
                optimizedSize: Math.floor(vendorSize * 0.8),
                savings: vendorSize - Math.floor(vendorSize * 0.8),
                type: 'vendor-split',
                priority: 'high',
                description: 'Vendor bundle is too large. Consider dynamic imports for vendor modules.',
                difficulty: 'medium',
                implementationTime: '1-2 hours',
            })
        }

        // Large assets recommendations
        assets
            .filter(asset => asset.size > 100 * 1024) // Assets > 100KB
            .forEach(asset => {
                const optimizationType = this.getOptimizationType(asset)
                recommendations.push({
                    assetName: asset.name,
                    currentSize: asset.size,
                    optimizedSize: Math.floor(asset.size * 0.6),
                    savings: asset.size - Math.floor(asset.size * 0.6),
                    type: optimizationType,
                    priority: optimizationType === 'compress' ? 'high' : 'medium',
                    description: `Large ${asset.type} asset detected. Consider ${optimizationType} for optimization.`,
                    difficulty: 'easy',
                    implementationTime: '30 minutes',
                })
            })

        // Module optimization recommendations
        const largeModules = modules
            .filter(module => module.size > 50 * 1024) // Modules > 50KB
            .slice(0, 5) // Top 5

        largeModules.forEach(module => {
            recommendations.push({
                assetName: module.name,
                currentSize: module.size,
                optimizedSize: Math.floor(module.size * 0.7),
                savings: module.size - Math.floor(module.size * 0.7),
                type: 'tree-shake',
                priority: module.isVendor ? 'low' : 'medium',
                description: 'Large module detected. Consider tree-shaking or code splitting.',
                difficulty: 'medium',
                implementationTime: '1-3 hours',
            })
        })

        return recommendations
    }

    /**
     * Analyzes build performance trends from historical data.
     * @param historicalData - Array of historical performance data
     * @returns Performance trend analysis with direction and confidence
     */
    public analyzePerformanceTrends(
        historicalData: Array<HistoricalPerformanceData>,
    ): {
        direction: 'improving' | 'declining' | 'stable'
        changePercentage: number
        confidence: number
        trends: {
            buildTime: 'improving' | 'declining' | 'stable'
            bundleSize: 'improving' | 'declining' | 'stable'
            memory: 'improving' | 'declining' | 'stable'
        }
    } {
        if (historicalData.length < 3) {
            return {
                direction: 'stable',
                changePercentage: 0,
                confidence: 0,
                trends: {
                    buildTime: 'stable',
                    bundleSize: 'stable',
                    memory: 'stable',
                },
            }
        }

        // Analyze trends for key metrics
        const buildTimeTrend = this.analyzeMetricTrend(
            historicalData.map(d => d.metrics.totalBuildTime).filter(Boolean),
        )
        const bundleSizeTrend = this.analyzeMetricTrend(
            historicalData.map(d => d.metrics.bundleAnalysis?.totalSize).filter(Boolean),
        )
        const memoryTrend = this.analyzeMetricTrend(
            historicalData.map(d => d.metrics.peakMemoryUsage).filter(Boolean),
        )

        // Calculate overall direction
        const trends = [buildTimeTrend, bundleSizeTrend, memoryTrend]
        const improving = trends.filter(t => t.direction === 'improving').length
        const declining = trends.filter(t => t.direction === 'declining').length

        let overallDirection: 'improving' | 'declining' | 'stable'
        if (improving > declining) {
            overallDirection = 'improving'
        } else if (declining > improving) {
            overallDirection = 'declining'
        } else {
            overallDirection = 'stable'
        }

        return {
            direction: overallDirection,
            changePercentage: Math.round((declining - improving) / trends.length * 100),
            confidence: this.calculateTrendConfidence(historicalData),
            trends: {
                buildTime: buildTimeTrend.direction,
                bundleSize: bundleSizeTrend.direction,
                memory: memoryTrend.direction,
            },
        }
    }

    // Private helper methods

    private calculateBuildTimeScore(buildTime: number): number {
        const { buildTime: budget } = this.budgets
        if (!budget) return 100

        const ratio = buildTime / budget
        if (ratio <= 0.5) return 100
        if (ratio <= 0.75) return 90
        if (ratio <= 1.0) return 75
        if (ratio <= 1.5) return 60
        if (ratio <= 2.0) return 45
        return 30
    }

    private calculateBundleSizeScore(bundleAnalysis?: any): number {
        if (!bundleAnalysis) return 100

        const { totalSize } = bundleAnalysis
        const { bundleSize: budget } = this.budgets
        if (!budget) return 100

        const ratio = totalSize / budget
        if (ratio <= 0.5) return 100
        if (ratio <= 0.75) return 90
        if (ratio <= 1.0) return 75
        if (ratio <= 1.5) return 60
        if (ratio <= 2.0) return 45
        return 30
    }

    private calculatePerformanceScore(metrics: BuildPerformanceMetrics): number {
        let score = 100

        // Deduct points for performance hints
        if (metrics.performanceHints) {
            metrics.performanceHints.forEach(hint => {
                if (hint.severity === 'error') score -= 20
                else if (hint.severity === 'warning') score -= 10
            })
        }

        // Deduct points for module count
        if (metrics.moduleCount > this.budgets.moduleCount!) {
            const excess = metrics.moduleCount - this.budgets.moduleCount!
            score -= Math.min(20, Math.floor(excess / 100) * 5)
        }

        return Math.max(0, score)
    }

    private calculateCacheScore(metrics: BuildPerformanceMetrics): number {
        // Simplified cache score calculation
        // In a real implementation, this would analyze actual cache hit rates
        // Base score calculation
        
        // Adjust based on build time (faster builds often indicate better caching)
        const buildTime = metrics.totalBuildTime
        if (buildTime < 10000) return 90 // Fast build
        if (buildTime < 20000) return 80 // Moderate build
        if (buildTime < 30000) return 70 // Slow build
        return 60 // Very slow build
    }

    private calculateMemoryScore(peakMemoryUsage?: number): number {
        if (!peakMemoryUsage) return 100

        const { memoryUsage: budget } = this.budgets
        if (!budget) return 100

        const ratio = peakMemoryUsage / budget
        if (ratio <= 0.5) return 100
        if (ratio <= 0.75) return 85
        if (ratio <= 1.0) return 70
        if (ratio <= 1.5) return 50
        return 30
    }

    private generateGradeAndStatus(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F', status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' } {
        let grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'

        if (score >= 90) {
            grade = 'A'
            status = 'excellent'
        } else if (score >= 80) {
            grade = 'B'
            status = 'good'
        } else if (score >= 70) {
            grade = 'C'
            status = 'fair'
        } else if (score >= 60) {
            grade = 'D'
            status = 'poor'
        } else if (score >= 50) {
            grade = 'E'
            status = 'poor'
        } else {
            grade = 'F'
            status = 'critical'
        }

        return { grade, status }
    }

    private generateRecommendations(scores: {
        buildTimeScore: number
        bundleSizeScore: number
        performanceScore: number
        cacheScore: number
        memoryScore: number
        metrics: BuildPerformanceMetrics
    }): Array<string> {
        const recommendations: Array<string> = []

        if (scores.buildTimeScore < 70) {
            recommendations.push('Consider optimizing build configuration or reducing dependencies to improve build time')
        }

        if (scores.bundleSizeScore < 70) {
            recommendations.push('Implement code splitting and tree shaking to reduce bundle size')
        }

        if (scores.performanceScore < 70) {
            recommendations.push('Address performance hints and optimize bundle composition')
        }

        if (scores.cacheScore < 70) {
            recommendations.push('Optimize build cache configuration and avoid unnecessary rebuilds')
        }

        if (scores.memoryScore < 70) {
            recommendations.push('Consider increasing memory limits or optimizing memory-intensive operations')
        }

        return recommendations
    }

    private checkRegression(
        currentValue: number,
        baselineValue: number,
        type: 'build-time' | 'bundle-size' | 'memory' | 'performance',
        thresholdPercent: number,
    ): PerformanceRegression | null {
        const percentageChange = ((currentValue - baselineValue) / baselineValue) * 100

        if (percentageChange > thresholdPercent) {
            const severity = percentageChange > thresholdPercent * 2 ? 'critical' : 
                percentageChange > thresholdPercent * 1.5 ? 'major' : 'minor'

            return {
                type,
                currentValue,
                previousValue: baselineValue,
                percentageChange,
                severity,
                isBlocking: severity === 'critical',
                analysis: `${type} increased by ${percentageChange.toFixed(1)}% compared to baseline`,
                recommendations: this.getRegressionRecommendations(type, percentageChange),
            }
        }

        return null
    }

    private getRegressionRecommendations(type: string, _changePercent: number): Array<string> {
        switch (type) {
            case 'build-time':
                return [
                    'Analyze build process to identify bottlenecks',
                    'Consider parallelization or caching improvements',
                    'Review and optimize dependency management',
                ]
            case 'bundle-size':
                return [
                    'Implement code splitting for large dependencies',
                    'Review and remove unused dependencies',
                    'Consider dynamic imports for non-critical features',
                ]
            case 'memory':
                return [
                    'Increase Node.js memory limits',
                    'Optimize memory-intensive build operations',
                    'Consider incremental builds to reduce memory usage',
                ]
            default:
                return ['Review build configuration and optimization settings']
        }
    }

    private calculateBaseline(historicalData: Array<HistoricalPerformanceData>): BuildPerformanceMetrics {
        if (historicalData.length === 0) {
            return {} as BuildPerformanceMetrics
        }

        // Calculate average values for baseline
        const totalBuildTime = historicalData.reduce(
            (sum, d) => sum + d.metrics.totalBuildTime, 0,
        ) / historicalData.length
        const avgBundleSize = historicalData.reduce(
            (sum, d) => sum + (d.metrics.bundleAnalysis?.totalSize || 0), 0,
        ) / historicalData.length
        const avgMemory = historicalData.reduce(
            (sum, d) => sum + (d.metrics.peakMemoryUsage || 0), 0,
        ) / historicalData.length

        return {
            totalBuildTime,
            bundleAnalysis: { totalSize: avgBundleSize } as any,
            peakMemoryUsage: avgMemory,
        } as BuildPerformanceMetrics
    }

    private analyzeMetricTrend(values: Array<number>): { direction: 'improving' | 'declining' | 'stable' } {
        if (values.length < 3) {
            return { direction: 'stable' }
        }

        // Simple linear regression to determine trend
        const n = values.length
        const sumX = values.reduce((sum, _, i) => sum + i, 0)
        const sumY = values.reduce((sum, val) => sum + val, 0)
        const sumXY = values.reduce((sum, val, i) => sum + i * val, 0)
        const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0)

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

        if (slope > 0) return { direction: 'declining' } // Higher values = worse performance
        if (slope < 0) return { direction: 'improving' } // Lower values = better performance
        return { direction: 'stable' }
    }

    private calculateTrendConfidence(historicalData: Array<HistoricalPerformanceData>): number {
        // Simplified confidence calculation based on data consistency
        const recentBuilds = historicalData.slice(-5)
        if (recentBuilds.length < 3) return 0.5

        const buildTimes = recentBuilds.map(d => d.metrics.totalBuildTime)
        const avg = buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length
        const variance = buildTimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / buildTimes.length
        const coefficientOfVariation = Math.sqrt(variance) / avg

        // Lower coefficient of variation = higher confidence
        return Math.max(0.3, Math.min(1.0, 1 - coefficientOfVariation))
    }

    private getOptimizationType(asset: any): 'compress' | 'split' | 'lazy-load' | 'tree-shake' | 'vendor-split' {
        if (asset.type === 'image') return 'compress'
        if (asset.type === 'javascript') return 'tree-shake'
        if (asset.size > 200 * 1024) return 'split'
        return 'compress'
    }
}