// import { BuildHealthScoring } from './buildHealthScoring'
import type { BuildPerformanceMetrics, BuildHealthScore, HistoricalPerformanceData } from '../types/performance'

/**
 * Compares build performance across different environments.
 */
export class EnvironmentPerformanceComparison {
    private readonly environments = new Map<string, EnvironmentData>()
    // private readonly _healthScoring: BuildHealthScoring

    constructor(_budgets?: Record<string, unknown>) {
        // this._healthScoring = new BuildHealthScoring(budgets)
    }

    /**
     * Adds environment performance data for comparison.
     * @param environmentName - Name of the environment
     * @param data - Performance data for the environment
     */
    public addEnvironmentData(environmentName: string, data: EnvironmentPerformanceData): void {
        this.environments.set(environmentName, {
            name: environmentName,
            data,
            lastUpdated: new Date(),
        })
    }

    /**
     * Compares performance across all environments.
     * @returns Performance comparison with rankings and recommendations
     */
    public compareEnvironments(): {
        comparison: EnvironmentComparison
        rankings: Array<EnvironmentRanking>
        insights: PerformanceInsights
        recommendations: Array<string>
    } {
        const envNames = Array.from(this.environments.keys())
        const comparison = this.generateEnvironmentComparison(envNames)
        const rankings = this.rankEnvironments(envNames)
        const insights = this.generatePerformanceInsights(comparison)
        const recommendations = this.generateComparisonRecommendations(comparison, rankings)

        return {
            comparison,
            rankings,
            insights,
            recommendations,
        }
    }

    /**
     * Analyzes performance trends across environments.
     * @returns Trend analysis with correlations and predictions
     */
    public analyzePerformanceTrends(): {
        trends: EnvironmentTrendAnalysis
        correlations: PerformanceCorrelations
        predictions: PerformancePredictions
    } {
        const trends = this.analyzeEnvironmentTrends()
        const correlations = this.findPerformanceCorrelations()
        const predictions = this.generatePerformancePredictions()

        return {
            trends,
            correlations,
            predictions,
        }
    }

    /**
     * Generates environment-specific optimization recommendations.
     * @returns Record of optimization recommendations per environment
     */
    public generateEnvironmentOptimizations(): Record<string, EnvironmentOptimization> {
        const optimizations: Record<string, EnvironmentOptimization> = {}

        this.environments.forEach((envData, envName) => {
            optimizations[envName] = this.generateEnvironmentOptimization(envData)
        })

        return optimizations
    }

    /**
     * Creates performance baseline for environments.
     * @returns Record of performance baselines per environment
     */
    public createPerformanceBaselines(): Record<string, PerformanceBaseline> {
        const baselines: Record<string, PerformanceBaseline> = {}

        this.environments.forEach((envData, envName) => {
            baselines[envName] = this.createEnvironmentBaseline(envData)
        })

        return baselines
    }

    /**
     * Detects performance anomalies across environments.
     * @returns Detected anomalies with severity levels and alerts
     */
    public detectPerformanceAnomalies(): {
        anomalies: Array<PerformanceAnomaly>
        alerts: Array<PerformanceAlert>
        severity: 'low' | 'medium' | 'high'
    } {
        const anomalies = this.findPerformanceAnomalies()
        const alerts = this.generatePerformanceAlerts(anomalies)
        const severity = this.calculateOverallSeverity(anomalies)

        return {
            anomalies,
            alerts,
            severity,
        }
    }

    // Private helper methods

    private generateEnvironmentComparison(envNames: Array<string>): EnvironmentComparison {
        const comparison: EnvironmentComparison = {
            metrics: {},
            healthScores: {},
            bundleAnalysis: {},
            cachePerformance: {},
            buildTimes: {},
            memoryUsage: {},
        }

        envNames.forEach((envName) => {
            const envData = this.environments.get(envName)
            if (!envData) return

            const { data } = envData

            // Compare metrics
            comparison.metrics[envName] = {
                totalBuildTime: data.metrics?.totalBuildTime || 0,
                bundleSize: data.bundleAnalysis?.totalSize || 0,
                memoryUsage: data.metrics?.peakMemoryUsage || 0,
                moduleCount: data.metrics?.moduleCount || 0,
                assetCount: data.metrics?.assetCount || 0,
            }

            // Compare health scores
            if (data.metrics && data.healthScore) {
                comparison.healthScores[envName] = data.healthScore
            }

            // Compare bundle analysis
            if (data.bundleAnalysis) {
                comparison.bundleAnalysis[envName] = {
                    totalSize: data.bundleAnalysis.totalSize,
                    gzippedSize: data.bundleAnalysis.gzippedSize,
                    vendorSize: data.bundleAnalysis.vendorSize,
                    appSize: data.bundleAnalysis.appSize,
                    chunkCount: data.bundleAnalysis.chunks.length,
                }
            }

            // Compare cache performance
            if (data.cachePerformance) {
                comparison.cachePerformance[envName] = data.cachePerformance
            }

            // Compare build times
            comparison.buildTimes[envName] = data.metrics?.totalBuildTime || 0

            // Compare memory usage
            comparison.memoryUsage[envName] = data.metrics?.peakMemoryUsage || 0
        })

        return comparison
    }

    private rankEnvironments(envNames: Array<string>): Array<EnvironmentRanking> {
        return envNames
            .map((envName) => {
                const envData = this.environments.get(envName)
                if (!envData) return null

                const score = this.calculateEnvironmentScore(envData)
                return {
                    environment: envName,
                    score,
                    rank: 0, // Will be set after sorting
                    strengths: this.identifyEnvironmentStrengths(envData),
                    weaknesses: this.identifyEnvironmentWeaknesses(envData),
                }
            })
            .filter((ranking): ranking is EnvironmentRanking => ranking !== null)
            .sort((a, b) => b.score - a.score)
            .map((ranking, index) => ({ ...ranking, rank: index + 1 }))
    }

    private generatePerformanceInsights(comparison: EnvironmentComparison): PerformanceInsights {
        const insights: PerformanceInsights = {
            fastestBuild: this.findFastestEnvironment(comparison.buildTimes),
            mostEfficientMemory: this.findMostEfficientEnvironment(comparison.memoryUsage),
            bestBundleOptimization: this.findBestBundleOptimization(comparison.bundleAnalysis),
            bestCachePerformance: this.findBestCachePerformance(comparison.cachePerformance),
            biggestDiscrepancies: this.findBiggestDiscrepancies(comparison),
            optimizationOpportunities: this.findOptimizationOpportunities(comparison),
        }

        return insights
    }

    private generateComparisonRecommendations(comparison: EnvironmentComparison, rankings: Array<EnvironmentRanking>): Array<string> {
        const recommendations: Array<string> = []

        // Performance gap recommendations
        const topPerformer = rankings[0]
        const worstPerformer = rankings[rankings.length - 1]

        if (topPerformer && worstPerformer) {
            const performanceGap = topPerformer.score - worstPerformer.score
            if (performanceGap > 20) {
                recommendations.push(
                    `Significant performance gap detected: ${performanceGap} points between "${topPerformer.environment}" (best) and "${worstPerformer.environment}" (worst)`
                )
                recommendations.push(
                    `Analyze configuration differences between "${topPerformer.environment}" and "${worstPerformer.environment}" to identify optimization opportunities`
                )
            }
        }

        // Build time recommendations
        const buildTimeValues = Object.values(comparison.buildTimes)
        const avgBuildTime = buildTimeValues.reduce((sum, time) => sum + time, 0) / buildTimeValues.length

        Object.entries(comparison.buildTimes).forEach(([env, time]) => {
            if (time > avgBuildTime * 1.3) {
                recommendations.push(
                    `Environment "${env}" has significantly slower build times (${this.formatTime(time)} vs avg ${this.formatTime(avgBuildTime)})`
                )
            }
        })

        // Memory usage recommendations
        const memoryValues = Object.values(comparison.memoryUsage)
        const avgMemory = memoryValues.reduce((sum, memory) => sum + memory, 0) / memoryValues.length

        Object.entries(comparison.memoryUsage).forEach(([env, memory]) => {
            if (memory > avgMemory * 1.4) {
                recommendations.push(
                    `Environment "${env}" has high memory usage (${this.formatMemory(memory)} vs avg ${this.formatMemory(avgMemory)})`
                )
            }
        })

        return recommendations
    }

    private analyzeEnvironmentTrends(): EnvironmentTrendAnalysis {
        const trends: EnvironmentTrendAnalysis = {
            buildTimeTrends: {},
            memoryTrends: {},
            bundleSizeTrends: {},
            healthScoreTrends: {},
            overallDirection: 'stable',
        }

        this.environments.forEach((_envData, envName) => {
            // Simplified trend analysis
            // In a real implementation, this would analyze historical data
            // envData.data is intentionally unused but kept for API compatibility

            trends.buildTimeTrends[envName] = {
                direction: 'stable',
                changeRate: 0,
                confidence: 0.5,
            }

            trends.memoryTrends[envName] = {
                direction: 'stable',
                changeRate: 0,
                confidence: 0.5,
            }

            trends.bundleSizeTrends[envName] = {
                direction: 'stable',
                changeRate: 0,
                confidence: 0.5,
            }

            trends.healthScoreTrends[envName] = {
                direction: 'stable',
                changeRate: 0,
                confidence: 0.5,
            }
        })

        return trends
    }

    private findPerformanceCorrelations(): PerformanceCorrelations {
        const correlations: PerformanceCorrelations = {
            buildTimeVsMemory: { correlation: 0, strength: 'weak' },
            bundleSizeVsBuildTime: { correlation: 0, strength: 'weak' },
            cacheVsBuildTime: { correlation: 0, strength: 'weak' },
        }

        // Simplified correlation analysis
        // In a real implementation, this would calculate actual correlations
        return correlations
    }

    private generatePerformancePredictions(): PerformancePredictions {
        const predictions: PerformancePredictions = {
            nextBuildTimes: {},
            predictedIssues: [],
            optimizationSuggestions: [],
        }

        this.environments.forEach((envData, envName) => {
            // Simplified predictions
            const currentBuildTime = envData.data.metrics?.totalBuildTime || 0
            predictions.nextBuildTimes[envName] = {
                predicted: currentBuildTime * 1.1, // 10% increase assumption
                confidence: 0.6,
                factors: ['code growth', 'dependency additions'],
            }
        })

        return predictions
    }

    private generateEnvironmentOptimization(envData: EnvironmentData): EnvironmentOptimization {
        const { data } = envData
        const recommendations: Array<string> = []

        // Build time optimizations
        if (data.metrics && data.metrics.totalBuildTime > 30000) {
            // > 30s
            recommendations.push('Optimize build configuration to reduce build time')
        }

        // Memory optimizations
        if (data.metrics && data.metrics.peakMemoryUsage > 1024) {
            // > 1GB
            recommendations.push('Consider increasing memory limits or optimizing memory usage')
        }

        // Bundle size optimizations
        if (data.bundleAnalysis && data.bundleAnalysis.totalSize > 1024 * 1024) {
            // > 1MB
            recommendations.push('Implement code splitting to reduce bundle size')
        }

        // Cache optimizations
        if (data.cachePerformance && data.cachePerformance.hitRate < 0.8) {
            recommendations.push('Improve cache configuration to increase hit rate')
        }

        return {
            recommendations,
            priority: this.determineOptimizationPriority(data),
            estimatedImpact: this.estimateOptimizationImpact(data),
            implementationSteps: this.generateImplementationSteps(data),
        }
    }

    private createEnvironmentBaseline(envData: EnvironmentData): PerformanceBaseline {
        const { data } = envData

        return {
            buildTime: data.metrics?.totalBuildTime || 0,
            memoryUsage: data.metrics?.peakMemoryUsage || 0,
            bundleSize: data.bundleAnalysis?.totalSize || 0,
            healthScore: data.healthScore?.overallScore || 0,
            establishedDate: envData.lastUpdated,
            confidence: 0.8,
        }
    }

    private findPerformanceAnomalies(): Array<PerformanceAnomaly> {
        const anomalies: Array<PerformanceAnomaly> = []

        // Detect outliers in build times
        const buildTimes = Array.from(this.environments.values())
            .map((env) => env.data.metrics?.totalBuildTime || 0)
            .filter((time) => time > 0)

        if (buildTimes.length > 2) {
            const avgBuildTime = buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length
            const stdDev = Math.sqrt(buildTimes.reduce((sum, time) => sum + Math.pow(time - avgBuildTime, 2), 0) / buildTimes.length)

            this.environments.forEach((envData, envName) => {
                const buildTime = envData.data.metrics?.totalBuildTime || 0
                if (buildTime > avgBuildTime + 2 * stdDev) {
                    anomalies.push({
                        type: 'build-time-outlier',
                        environment: envName,
                        value: buildTime,
                        expected: avgBuildTime,
                        severity: 'high',
                        description: 'Build time significantly higher than average',
                    })
                }
            })
        }

        return anomalies
    }

    private generatePerformanceAlerts(anomalies: Array<PerformanceAnomaly>): Array<PerformanceAlert> {
        return anomalies.map((anomaly) => ({
            environment: anomaly.environment,
            type: anomaly.type,
            severity: anomaly.severity,
            message: this.formatAnomalyMessage(anomaly),
            action: this.getRecommendedAction(anomaly),
            timestamp: new Date(),
        }))
    }

    private calculateOverallSeverity(anomalies: Array<PerformanceAnomaly>): 'low' | 'medium' | 'high' {
        const highSeverityCount = anomalies.filter((a) => a.severity === 'high').length
        const mediumSeverityCount = anomalies.filter((a) => a.severity === 'medium').length

        if (highSeverityCount > 0) return 'high'
        if (mediumSeverityCount > 2) return 'medium'
        return 'low'
    }

    private calculateEnvironmentScore(envData: EnvironmentData): number {
        const { data } = envData
        let score = 0
        let factors = 0

        // Build time score (30% weight)
        if (data.metrics?.totalBuildTime) {
            const buildTimeScore = Math.max(0, 100 - (data.metrics.totalBuildTime / 300) * 100)
            score += buildTimeScore * 0.3
            factors++
        }

        // Memory usage score (25% weight)
        if (data.metrics?.peakMemoryUsage) {
            const memoryScore = Math.max(0, 100 - (data.metrics.peakMemoryUsage / 1024) * 100)
            score += memoryScore * 0.25
            factors++
        }

        // Bundle size score (25% weight)
        if (data.bundleAnalysis?.totalSize) {
            const bundleScore = Math.max(0, 100 - (data.bundleAnalysis.totalSize / (1024 * 1024)) * 100)
            score += bundleScore * 0.25
            factors++
        }

        // Cache performance score (20% weight)
        if (data.cachePerformance?.hitRate) {
            score += data.cachePerformance.hitRate * 100 * 0.2
            factors++
        }

        return factors > 0 ? score / factors : 0
    }

    private identifyEnvironmentStrengths(envData: EnvironmentData): Array<string> {
        const strengths: Array<string> = []
        const { data } = envData

        if (data.metrics?.totalBuildTime && data.metrics.totalBuildTime < 15000) {
            strengths.push('Fast build times')
        }

        if (data.cachePerformance?.hitRate && data.cachePerformance.hitRate > 0.9) {
            strengths.push('Excellent cache performance')
        }

        if (data.bundleAnalysis?.totalSize && data.bundleAnalysis.totalSize < 500 * 1024) {
            strengths.push('Optimized bundle size')
        }

        if (data.healthScore?.overallScore && data.healthScore.overallScore > 85) {
            strengths.push('High build health score')
        }

        return strengths
    }

    private identifyEnvironmentWeaknesses(envData: EnvironmentData): Array<string> {
        const weaknesses: Array<string> = []
        const { data } = envData

        if (data.metrics?.totalBuildTime && data.metrics.totalBuildTime > 45000) {
            weaknesses.push('Slow build times')
        }

        if (data.metrics?.peakMemoryUsage && data.metrics.peakMemoryUsage > 1500) {
            weaknesses.push('High memory usage')
        }

        if (data.bundleAnalysis?.totalSize && data.bundleAnalysis.totalSize > 1024 * 1024) {
            weaknesses.push('Large bundle size')
        }

        if (data.cachePerformance?.hitRate && data.cachePerformance.hitRate < 0.7) {
            weaknesses.push('Poor cache performance')
        }

        return weaknesses
    }

    private findFastestEnvironment(buildTimes: Record<string, number>): string {
        const entries = Object.entries(buildTimes)
        if (entries.length === 0) return ''

        let fastestEnv = entries[0]![0]
        let fastestTime = entries[0]![1]

        for (const [env, time] of entries.slice(1)) {
            if (time < fastestTime) {
                fastestEnv = env
                fastestTime = time
            }
        }

        return fastestEnv
    }

    private findMostEfficientEnvironment(memoryUsage: Record<string, number>): string {
        const entries = Object.entries(memoryUsage)
        if (entries.length === 0) return ''

        let mostEfficientEnv = entries[0]![0]
        let mostEfficientMemory = entries[0]![1]

        for (const [env, memory] of entries.slice(1)) {
            if (memory < mostEfficientMemory) {
                mostEfficientEnv = env
                mostEfficientMemory = memory
            }
        }

        return mostEfficientEnv
    }

    private findBestBundleOptimization(bundleAnalysis: Record<string, any>): string {
        const entries = Object.entries(bundleAnalysis)
        if (entries.length === 0) return ''

        let bestEnv = entries[0]![0]
        let bestData = entries[0]![1]

        for (const [env, data] of entries.slice(1)) {
            if (data && bestData && data.totalSize < bestData.totalSize) {
                bestEnv = env
                bestData = data
            }
        }

        return bestEnv
    }

    private findBestCachePerformance(cachePerformance: Record<string, any>): string {
        const entries = Object.entries(cachePerformance)
        if (entries.length === 0) return ''

        let bestEnv = entries[0]![0]
        let bestData = entries[0]![1]

        for (const [env, data] of entries.slice(1)) {
            if (data && bestData && data.hitRate > bestData.hitRate) {
                bestEnv = env
                bestData = data
            }
        }

        return bestEnv
    }

    private findBiggestDiscrepancies(comparison: EnvironmentComparison): Array<{
        metric: string
        environments: Array<string>
        difference: number
    }> {
        const discrepancies = []

        // Build time discrepancies
        const buildTimes = Object.values(comparison.buildTimes)
        if (buildTimes.length > 1) {
            const maxBuildTime = Math.max(...buildTimes)
            const minBuildTime = Math.min(...buildTimes)
            if (maxBuildTime - minBuildTime > 10000) {
                // > 10s difference
                discrepancies.push({
                    metric: 'build-time',
                    environments: Object.keys(comparison.buildTimes),
                    difference: maxBuildTime - minBuildTime,
                })
            }
        }

        return discrepancies
    }

    private findOptimizationOpportunities(comparison: EnvironmentComparison): Array<string> {
        const opportunities: Array<string> = []

        // Find environments that can be optimized
        Object.entries(comparison.buildTimes).forEach(([env, time]) => {
            if (time > 30000) {
                // > 30s
                opportunities.push(`Optimize build time for ${env} environment`)
            }
        })

        return opportunities
    }

    private determineOptimizationPriority(data: EnvironmentPerformanceData): 'high' | 'medium' | 'low' {
        let priorityScore = 0

        if (data.metrics?.totalBuildTime && data.metrics.totalBuildTime > 45000) priorityScore += 3
        if (data.metrics?.peakMemoryUsage && data.metrics.peakMemoryUsage > 1500) priorityScore += 2
        if (data.bundleAnalysis?.totalSize && data.bundleAnalysis.totalSize > 1024 * 1024) priorityScore += 2

        if (priorityScore >= 4) return 'high'
        if (priorityScore >= 2) return 'medium'
        return 'low'
    }

    private estimateOptimizationImpact(data: EnvironmentPerformanceData): {
        buildTimeReduction: number
        memoryReduction: number
        bundleSizeReduction: number
    } {
        return {
            buildTimeReduction: data.metrics?.totalBuildTime ? data.metrics.totalBuildTime * 0.2 : 0,
            memoryReduction: data.metrics?.peakMemoryUsage ? data.metrics.peakMemoryUsage * 0.15 : 0,
            bundleSizeReduction: data.bundleAnalysis?.totalSize ? data.bundleAnalysis.totalSize * 0.25 : 0,
        }
    }

    private generateImplementationSteps(data: EnvironmentPerformanceData): Array<string> {
        const steps: Array<string> = []

        if (data.metrics?.totalBuildTime && data.metrics.totalBuildTime > 30000) {
            steps.push('Optimize webpack configuration for faster builds')
            steps.push('Implement build cache improvements')
        }

        if (data.bundleAnalysis?.totalSize && data.bundleAnalysis.totalSize > 1024 * 1024) {
            steps.push('Implement code splitting strategies')
            steps.push('Review and remove unused dependencies')
        }

        if (data.cachePerformance?.hitRate && data.cachePerformance.hitRate < 0.8) {
            steps.push('Optimize cache configuration')
            steps.push('Implement cache warming strategies')
        }

        return steps
    }

    private formatAnomalyMessage(anomaly: PerformanceAnomaly): string {
        switch (anomaly.type) {
            case 'build-time-outlier':
                return `Build time (${this.formatTime(anomaly.value)}) is significantly higher than expected (${this.formatTime(anomaly.expected)})`
            default:
                return `Anomaly detected in ${anomaly.type}`
        }
    }

    private getRecommendedAction(anomaly: PerformanceAnomaly): string {
        switch (anomaly.type) {
            case 'build-time-outlier':
                return 'Investigate build configuration and optimize performance'
            default:
                return 'Review and optimize configuration'
        }
    }

    private formatTime(milliseconds: number): string {
        if (milliseconds < 1000) {
            return `${milliseconds}ms`
        }
        return `${(milliseconds / 1000).toFixed(1)}s`
    }

    private formatMemory(mb: number): string {
        if (mb < 1024) {
            return `${mb.toFixed(0)}MB`
        }
        return `${(mb / 1024).toFixed(1)}GB`
    }
}

// Type definitions
interface EnvironmentData {
    name: string
    data: EnvironmentPerformanceData
    lastUpdated: Date
}

interface EnvironmentPerformanceData {
    metrics?: BuildPerformanceMetrics
    healthScore?: BuildHealthScore
    bundleAnalysis?: any
    cachePerformance?: any
    historicalData?: Array<HistoricalPerformanceData>
}

interface EnvironmentComparison {
    metrics: Record<string, any>
    healthScores: Record<string, any>
    bundleAnalysis: Record<string, any>
    cachePerformance: Record<string, any>
    buildTimes: Record<string, number>
    memoryUsage: Record<string, number>
}

interface EnvironmentRanking {
    environment: string
    score: number
    rank: number
    strengths: Array<string>
    weaknesses: Array<string>
}

interface PerformanceInsights {
    fastestBuild: string
    mostEfficientMemory: string
    bestBundleOptimization: string
    bestCachePerformance: string
    biggestDiscrepancies: Array<{
        metric: string
        environments: Array<string>
        difference: number
    }>
    optimizationOpportunities: Array<string>
}

interface EnvironmentTrendAnalysis {
    buildTimeTrends: Record<string, { direction: string; changeRate: number; confidence: number }>
    memoryTrends: Record<string, { direction: string; changeRate: number; confidence: number }>
    bundleSizeTrends: Record<string, { direction: string; changeRate: number; confidence: number }>
    healthScoreTrends: Record<string, { direction: string; changeRate: number; confidence: number }>
    overallDirection: string
}

interface PerformanceCorrelations {
    buildTimeVsMemory: { correlation: number; strength: string }
    bundleSizeVsBuildTime: { correlation: number; strength: string }
    cacheVsBuildTime: { correlation: number; strength: string }
}

interface PerformancePredictions {
    nextBuildTimes: Record<string, { predicted: number; confidence: number; factors: Array<string> }>
    predictedIssues: Array<string>
    optimizationSuggestions: Array<string>
}

interface EnvironmentOptimization {
    recommendations: Array<string>
    priority: 'high' | 'medium' | 'low'
    estimatedImpact: {
        buildTimeReduction: number
        memoryReduction: number
        bundleSizeReduction: number
    }
    implementationSteps: Array<string>
}

interface PerformanceBaseline {
    buildTime: number
    memoryUsage: number
    bundleSize: number
    healthScore: number
    establishedDate: Date
    confidence: number
}

interface PerformanceAnomaly {
    type: string
    environment: string
    value: number
    expected: number
    severity: 'low' | 'medium' | 'high'
    description: string
}

interface PerformanceAlert {
    environment: string
    type: string
    severity: 'low' | 'medium' | 'high'
    message: string
    action: string
    timestamp: Date
}
