import * as fs from 'fs'
import * as path from 'path'

import type {
    BuildPerformanceMetrics,
    BuildHealthScore,
    PerformanceRegression,
    CIPerformanceConfig,
    HistoricalPerformanceData,
    CIContext,
    PerformanceTrends,
} from '../types/performance'
import { BuildHealthScoring } from '../utils/buildHealthScoring'

/**
 * CI/CD performance monitoring integration.
 */
export class CIPerformanceMonitoring {
    private readonly config: CIPerformanceConfig
    private readonly healthScoring: BuildHealthScoring
    private historicalData: Array<HistoricalPerformanceData> = []
    private readonly REPORTS_DIR = './ci-performance-reports'

    constructor(config: Partial<CIPerformanceConfig> = {}) {
        this.config = {
            enabled: true,
            budgets: {
                bundleSize: 1024 * 1024, // 1MB
                gzippedSize: 300 * 1024, // 300KB
                buildTime: 30000, // 30s
                memoryUsage: 1024, // 1GB
                moduleCount: 1000,
                assetCount: 100,
                performanceScore: 80,
            },
            regressionThresholds: {
                maxRegressionPercent: 15,
                failOnRegression: true,
                blockOnCritical: true,
            },
            trendAnalysis: {
                lookbackBuilds: 10,
                minConfidence: 0.7,
            },
            reporting: {
                detailedReports: true,
                trendCharts: true,
                enableComparison: true,
            },
            ...config,
        }

        this.healthScoring = new BuildHealthScoring(this.config.budgets)
        
        // Ensure reports directory exists
        if (!fs.existsSync(this.REPORTS_DIR)) {
            fs.mkdirSync(this.REPORTS_DIR, { recursive: true })
        }

        // Load historical data if available
        this.loadHistoricalData()
    }

    /**
     * Runs complete CI/CD performance monitoring workflow.
     * @param metrics - Build performance metrics
     * @param context - CI context information
     * @returns Object containing health score, regressions, deployment status, and recommendations
     */
    public async runCIPerformanceMonitoring(
        metrics: BuildPerformanceMetrics,
        context: CIContext,
    ): Promise<{
        healthScore: BuildHealthScore
        regressions: Array<PerformanceRegression>
        canDeploy: boolean
        reportPath: string
        recommendations: Array<string>
    }> {
        console.log('🚀 Starting CI/CD Performance Monitoring...')

        // Calculate build health score
        const healthScore = this.healthScoring.calculateHealthScore(metrics)
        
        // Detect performance regressions
        const regressions = this.detectRegressions(metrics)
        
        // Determine if deployment is allowed
        const canDeploy = this.shouldAllowDeployment(regressions, healthScore)
        
        // Generate comprehensive report
        const reportPath = await this.generatePerformanceReport(
            metrics, 
            healthScore, 
            regressions, 
            context,
        )
        
        // Generate recommendations
        const recommendations = this.generateDeploymentRecommendations(
            regressions, 
            healthScore, 
            canDeploy,
        )

        // Update historical data
        await this.updateHistoricalData(metrics, healthScore, context)

        // Log results
        this.logResults(healthScore, regressions, canDeploy)

        return {
            healthScore,
            regressions,
            canDeploy,
            reportPath,
            recommendations,
        }
    }

    /**
     * Tests pull request performance impact.
     * @param baseMetrics - Base branch metrics
     * @param headMetrics - PR branch metrics
     * @param prInfo - Pull request information
     * @returns Performance impact analysis and recommendations
     */
    public async testPullRequestPerformance(
        baseMetrics: BuildPerformanceMetrics,
        headMetrics: BuildPerformanceMetrics,
        prInfo: {
            number: number
            title: string
            author: string
            baseBranch: string
            headBranch: string
        },
    ): Promise<{
        performanceImpact: 'improved' | 'degraded' | 'neutral'
        detailedComparison: {
            buildTime: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            bundleSize: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            memoryUsage: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            moduleCount: {
                base: number
                current: number
                change: number
                changePercent: number
            }
        }
        blockingIssues: Array<PerformanceRegression>
        suggestions: Array<string>
    }> {
        console.log(`🔍 Testing performance impact of PR #${prInfo.number}...`)

        // Calculate performance impact
        const performanceImpact = this.calculatePerformanceImpact(baseMetrics, headMetrics)
        
        // Generate detailed comparison
        const detailedComparison = this.generateDetailedComparison(baseMetrics, headMetrics)
        
        // Identify blocking issues
        const blockingIssues = this.detectBlockingRegressions(headMetrics)
        
        // Generate suggestions
        const suggestions = this.generatePerformanceSuggestions(baseMetrics, headMetrics, performanceImpact)

        // Generate PR performance report
        const reportPath = await this.generatePRPerformanceReport(
            baseMetrics,
            headMetrics,
            performanceImpact,
            detailedComparison,
            prInfo,
        )

        console.log(`✅ Performance impact analysis complete: ${performanceImpact}`)
        console.log(`📊 Detailed report saved: ${reportPath}`)

        return {
            performanceImpact,
            detailedComparison,
            blockingIssues,
            suggestions,
        }
    }

    /**
     * Enforces performance budgets in deployment.
     * @param metrics - Build performance metrics
     * @returns Budget enforcement results with violations
     */
    public enforcePerformanceBudgets(
        metrics: BuildPerformanceMetrics,
    ): {
        passed: boolean
        violations: Array<{
            metric: string
            actual: number
            budget: number
            severity: 'warning' | 'error'
            recommendation: string
        }>
    } {
        const violations = []
        const { budgets } = this.config

        // Check bundle size budget
        if (metrics.bundleAnalysis && budgets.bundleSize) {
            const { totalSize } = metrics.bundleAnalysis
            if (totalSize > budgets.bundleSize) {
                violations.push({
                    metric: 'bundle-size',
                    actual: totalSize,
                    budget: budgets.bundleSize,
                    severity: (totalSize > budgets.bundleSize * 1.2 ? 'error' : 'warning') as 'warning' | 'error',
                    recommendation: 'Implement code splitting or optimize bundle size',
                })
            }
        }

        // Check build time budget
        if (budgets.buildTime && metrics.totalBuildTime > budgets.buildTime) {
            violations.push({
                metric: 'build-time',
                actual: metrics.totalBuildTime,
                budget: budgets.buildTime,
                severity: (metrics.totalBuildTime > budgets.buildTime * 1.5 ? 'error' : 'warning') as 'warning' | 'error',
                recommendation: 'Optimize build configuration or reduce dependencies',
            })
        }

        // Check memory usage budget
        if (budgets.memoryUsage && metrics.peakMemoryUsage > budgets.memoryUsage) {
            violations.push({
                metric: 'memory-usage',
                actual: metrics.peakMemoryUsage,
                budget: budgets.memoryUsage,
                severity: (metrics.peakMemoryUsage > budgets.memoryUsage * 1.3 ? 'error' : 'warning') as 'warning' | 'error',
                recommendation: 'Increase memory limits or optimize memory usage',
            })
        }

        // Check module count budget
        if (budgets.moduleCount && metrics.moduleCount > budgets.moduleCount) {
            violations.push({
                metric: 'module-count',
                actual: metrics.moduleCount,
                budget: budgets.moduleCount,
                severity: (metrics.moduleCount > budgets.moduleCount * 1.2 ? 'error' : 'warning') as 'warning' | 'error',
                recommendation: 'Review and remove unused modules or dependencies',
            })
        }

        return {
            passed: violations.filter(v => v.severity === 'error').length === 0,
            violations,
        }
    }

    /**
     * Generates performance trend analysis.
     * @returns Performance trends and analysis
     */
    public generatePerformanceTrends(): PerformanceTrends {
        if (this.historicalData.length < 3) {
            return {
                trends: {
                    direction: 'stable',
                    buildTime: { current: 0, trend: 0 },
                    bundleSize: { current: 0, trend: 0 },
                    memoryUsage: { current: 0, trend: 0 },
                    overall: { current: 0, trend: 0 },
                },
                analysis: 'Insufficient historical data for trend analysis',
                recommendations: [],
            }
        }

        // Analyze trends using the health scoring utility
        const trends = this.healthScoring.analyzePerformanceTrends(this.historicalData)

        // Calculate current values
        const latest = this.historicalData[this.historicalData.length - 1]
        const previous = this.historicalData[this.historicalData.length - 2]

        if (!latest) {
            return {
                trends: {
                    direction: 'stable' as const,
                    buildTime: { current: 0, trend: 0 },
                    bundleSize: { current: 0, trend: 0 },
                    memoryUsage: { current: 0, trend: 0 },
                    overall: { current: 0, trend: 0 },
                },
                analysis: 'No historical data available',
                recommendations: [],
            }
        }

        const hasValidBuildTimeData = previous &&
            latest.metrics.totalBuildTime &&
            previous.metrics.totalBuildTime &&
            previous.metrics.totalBuildTime > 0
            
        const buildTimeTrend = hasValidBuildTimeData ?
            ((latest.metrics.totalBuildTime - previous.metrics.totalBuildTime)
                / previous.metrics.totalBuildTime) * 100 : 0

        const hasValidBundleSizeData = latest.metrics.bundleAnalysis &&
            previous?.metrics.bundleAnalysis &&
            previous.metrics.bundleAnalysis.totalSize &&
            previous.metrics.bundleAnalysis.totalSize > 0
            
        const bundleSizeTrend = hasValidBundleSizeData ?
            ((latest.metrics.bundleAnalysis.totalSize - previous.metrics.bundleAnalysis.totalSize)
                / previous.metrics.bundleAnalysis.totalSize) * 100 : 0

        const hasValidMemoryData = previous &&
            latest.metrics.peakMemoryUsage &&
            previous.metrics.peakMemoryUsage &&
            previous.metrics.peakMemoryUsage > 0
            
        const memoryTrend = hasValidMemoryData ?
            ((latest.metrics.peakMemoryUsage - previous.metrics.peakMemoryUsage)
                / previous.metrics.peakMemoryUsage) * 100 : 0

        const overallTrend = trends.changePercentage

        return {
            trends: {
                direction: trends.direction,
                buildTime: {
                    current: latest.metrics.totalBuildTime || 0,
                    trend: buildTimeTrend,
                },
                bundleSize: {
                    current: latest.metrics.bundleAnalysis?.totalSize || 0,
                    trend: bundleSizeTrend,
                },
                memoryUsage: {
                    current: latest.metrics.peakMemoryUsage || 0,
                    trend: memoryTrend,
                },
                overall: {
                    current: latest.healthScore.overallScore,
                    trend: overallTrend,
                },
            },
            analysis: this.generateTrendAnalysis(trends),
            recommendations: this.generateTrendRecommendations(trends),
        }
    }

    // Private helper methods

    private detectRegressions(metrics: BuildPerformanceMetrics): Array<PerformanceRegression> {
        return this.healthScoring.detectRegressions(metrics, this.historicalData)
    }

    private shouldAllowDeployment(
        regressions: Array<PerformanceRegression>,
        healthScore: BuildHealthScore,
    ): boolean {
        // Check for critical regressions
        const criticalRegressions = regressions.filter(r => r.severity === 'critical')
        if (criticalRegressions.length > 0 && this.config.regressionThresholds.blockOnCritical) {
            return false
        }

        // Check overall health score
        if (healthScore.overallScore < 60) {
            return false
        }

        // Check for blocking regressions
        const blockingRegressions = regressions.filter(r => r.isBlocking)
        if (blockingRegressions.length > 0 && this.config.regressionThresholds.failOnRegression) {
            return false
        }

        return true
    }

    private generatePerformanceReport(
        metrics: BuildPerformanceMetrics,
        healthScore: BuildHealthScore,
        regressions: Array<PerformanceRegression>,
        context: CIContext,
    ): string {
        const report = {
            timestamp: new Date().toISOString(),
            context,
            metrics,
            healthScore,
            regressions,
            canDeploy: this.shouldAllowDeployment(regressions, healthScore),
            trends: this.generatePerformanceTrends(),
        }

        const filename = `ci-performance-${context.buildId || Date.now()}.json`
        const reportPath = path.join(this.REPORTS_DIR, filename)
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
        return reportPath
    }

    private generatePRPerformanceReport(
        baseMetrics: BuildPerformanceMetrics,
        headMetrics: BuildPerformanceMetrics,
        impact: 'improved' | 'degraded' | 'neutral',
        comparison: {
            buildTime: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            bundleSize: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            memoryUsage: {
                base: number
                current: number
                change: number
                changePercent: number
            }
            moduleCount: {
                base: number
                current: number
                change: number
                changePercent: number
            }
        },
        prInfo: {
            number: number
            title: string
            author: string
            baseBranch: string
            headBranch: string
        },
    ): string {
        const report = {
            timestamp: new Date().toISOString(),
            pullRequest: prInfo,
            performanceImpact: impact,
            baseMetrics,
            headMetrics,
            comparison,
            healthScore: {
                base: this.healthScoring.calculateHealthScore(baseMetrics),
                head: this.healthScoring.calculateHealthScore(headMetrics),
            },
        }

        const filename = `pr-performance-${prInfo.number}-${Date.now()}.json`
        const reportPath = path.join(this.REPORTS_DIR, filename)
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
        return reportPath
    }

    private generateDeploymentRecommendations(
        regressions: Array<PerformanceRegression>,
        healthScore: BuildHealthScore,
        canDeploy: boolean,
    ): Array<string> {
        const recommendations = []

        if (!canDeploy) {
            recommendations.push('❌ Deployment blocked due to performance issues')
            
            if (regressions.length > 0) {
                recommendations.push('Address performance regressions before deployment:')
                regressions.forEach(reg => {
                    recommendations.push(`  - ${reg.analysis}`)
                })
            }
            
            if (healthScore.overallScore < 60) {
                recommendations.push(`Build health score (${healthScore.overallScore}) is too low for deployment`)
            }
        } else {
            recommendations.push('✅ Deployment allowed')
            
            if (healthScore.grade !== 'A') {
                recommendations.push('Consider performance improvements:')
                healthScore.recommendations.forEach(rec => {
                    recommendations.push(`  - ${rec}`)
                })
            }
        }

        return recommendations
    }

    private calculatePerformanceImpact(
        base: BuildPerformanceMetrics,
        current: BuildPerformanceMetrics,
    ): 'improved' | 'degraded' | 'neutral' {
        let improvementScore = 0
        let metricsCount = 0

        // Build time impact
        if (base.totalBuildTime && current.totalBuildTime && base.totalBuildTime > 0) {
            const timeChange = ((current.totalBuildTime - base.totalBuildTime) / base.totalBuildTime) * 100
            improvementScore -= timeChange // Negative change is improvement
            metricsCount++
        }

        // Bundle size impact
        if (base.bundleAnalysis && current.bundleAnalysis &&
            base.bundleAnalysis.totalSize && base.bundleAnalysis.totalSize > 0) {
            const sizeChange = ((current.bundleAnalysis.totalSize - base.bundleAnalysis.totalSize)
                / base.bundleAnalysis.totalSize) * 100
            improvementScore -= sizeChange // Negative change is improvement
            metricsCount++
        }

        // Memory usage impact
        if (base.peakMemoryUsage && current.peakMemoryUsage && base.peakMemoryUsage > 0) {
            const memoryChange = ((current.peakMemoryUsage - base.peakMemoryUsage) / base.peakMemoryUsage) * 100
            improvementScore -= memoryChange // Negative change is improvement
            metricsCount++
        }

        if (metricsCount === 0) return 'neutral'

        const averageChange = improvementScore / metricsCount

        if (averageChange > 5) return 'degraded'
        if (averageChange < -5) return 'improved'
        return 'neutral'
    }

    private generateDetailedComparison(
        base: BuildPerformanceMetrics,
        current: BuildPerformanceMetrics,
    ): {
        buildTime: {
            base: number
            current: number
            change: number
            changePercent: number
        }
        bundleSize: {
            base: number
            current: number
            change: number
            changePercent: number
        }
        memoryUsage: {
            base: number
            current: number
            change: number
            changePercent: number
        }
        moduleCount: {
            base: number
            current: number
            change: number
            changePercent: number
        }
    } {
        return {
            buildTime: {
                base: base.totalBuildTime || 0,
                current: current.totalBuildTime || 0,
                change: (current.totalBuildTime || 0) - (base.totalBuildTime || 0),
                changePercent: base.totalBuildTime && base.totalBuildTime > 0 ?
                    (((current.totalBuildTime || 0) - base.totalBuildTime) / base.totalBuildTime) * 100 : 0,
            },
            bundleSize: {
                base: base.bundleAnalysis?.totalSize || 0,
                current: current.bundleAnalysis?.totalSize || 0,
                change: (current.bundleAnalysis?.totalSize || 0) - (base.bundleAnalysis?.totalSize || 0),
                changePercent: base.bundleAnalysis?.totalSize && base.bundleAnalysis.totalSize > 0 ?
                    (((current.bundleAnalysis?.totalSize || 0) - base.bundleAnalysis.totalSize)
                        / base.bundleAnalysis.totalSize) * 100 : 0,
            },
            memoryUsage: {
                base: base.peakMemoryUsage || 0,
                current: current.peakMemoryUsage || 0,
                change: (current.peakMemoryUsage || 0) - (base.peakMemoryUsage || 0),
                changePercent: base.peakMemoryUsage && base.peakMemoryUsage > 0 ?
                    (((current.peakMemoryUsage || 0) - base.peakMemoryUsage) / base.peakMemoryUsage) * 100 : 0,
            },
            moduleCount: {
                base: base.moduleCount || 0,
                current: current.moduleCount || 0,
                change: (current.moduleCount || 0) - (base.moduleCount || 0),
                changePercent: base.moduleCount && base.moduleCount > 0 ?
                    (((current.moduleCount || 0) - base.moduleCount) / base.moduleCount) * 100 : 0,
            },
        }
    }

    private detectBlockingRegressions(metrics: BuildPerformanceMetrics): Array<PerformanceRegression> {
        const regressions = this.detectRegressions(metrics)
        return regressions.filter(r => r.isBlocking || r.severity === 'critical')
    }

    private generatePerformanceSuggestions(
        base: BuildPerformanceMetrics,
        current: BuildPerformanceMetrics,
        impact: 'improved' | 'degraded' | 'neutral',
    ): Array<string> {
        const suggestions = []

        if (impact === 'degraded') {
            suggestions.push('⚠️ Performance degradation detected')
            
            if (base.totalBuildTime && current.totalBuildTime > base.totalBuildTime * 1.2) {
                suggestions.push('Build time increased by more than 20%. Consider optimizing build configuration.')
            }
            
            if (current.bundleAnalysis && base.bundleAnalysis &&
                base.bundleAnalysis.totalSize &&
                current.bundleAnalysis.totalSize > base.bundleAnalysis.totalSize * 1.1) {
                suggestions.push('Bundle size increased. Consider implementing code splitting.')
            }
        } else if (impact === 'improved') {
            suggestions.push('✅ Performance improvements detected!')
        }

        // Add optimization suggestions based on current metrics
        const healthScore = this.healthScoring.calculateHealthScore(current)
        if (healthScore.grade !== 'A') {
            suggestions.push(...healthScore.recommendations)
        }

        return suggestions
    }

    private generateTrendAnalysis(trends: {
        direction: 'improving' | 'declining' | 'stable'
        changePercentage: number
        confidence: number
        trends: {
            buildTime: 'improving' | 'declining' | 'stable'
            bundleSize: 'improving' | 'declining' | 'stable'
            memory: 'improving' | 'declining' | 'stable'
        }
    }): string {
        switch (trends.direction) {
            case 'improving':
                return 'Performance is improving over time. Keep up the good work!'
            case 'declining':
                return 'Performance is declining. Immediate attention recommended.'
            case 'stable':
                return 'Performance is stable. Consider optimization opportunities.'
            default:
                return 'Insufficient data for trend analysis.'
        }
    }

    private generateTrendRecommendations(trends: {
        direction: 'improving' | 'declining' | 'stable'
        changePercentage: number
        confidence: number
        trends: {
            buildTime: 'improving' | 'declining' | 'stable'
            bundleSize: 'improving' | 'declining' | 'stable'
            memory: 'improving' | 'declining' | 'stable'
        }
    }): Array<string> {
        const recommendations = []

        if (trends.direction === 'declining') {
            recommendations.push('Investigate recent changes causing performance decline')
            recommendations.push('Consider implementing performance monitoring alerts')
        }

        if (trends.trends.buildTime === 'declining') {
            recommendations.push('Build time optimization needed')
        }

        if (trends.trends.bundleSize === 'declining') {
            recommendations.push('Bundle size optimization required')
        }

        if (trends.trends.memory === 'declining') {
            recommendations.push('Memory usage optimization needed')
        }

        return recommendations
    }

    private async updateHistoricalData(
        metrics: BuildPerformanceMetrics,
        healthScore: BuildHealthScore,
        context: CIContext,
    ): Promise<void> {
        const historicalEntry: HistoricalPerformanceData = {
            buildId: context.buildId || Date.now().toString(),
            commit: {
                hash: context.commit,
                message: '',
                author: context.author,
                timestamp: new Date().toISOString(),
                branch: context.branch,
            },
            metrics,
            healthScore,
            trends: {
                direction: 'stable', // Would be calculated from historical context
                changePercentage: 0,
                confidence: 0.5,
            },
        }

        this.historicalData.push(historicalEntry)

        // Keep only the last 100 entries to prevent memory issues
        if (this.historicalData.length > 100) {
            this.historicalData = this.historicalData.slice(-100)
        }

        // Save to file
        await this.saveHistoricalData()
    }

    private loadHistoricalData(): void {
        const dataPath = path.join(this.REPORTS_DIR, 'historical-data.json')
        if (fs.existsSync(dataPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
                // Validate that the loaded data is an array before assigning
                if (Array.isArray(data)) {
                    this.historicalData = data
                } else {
                    console.warn('Invalid historical data format: expected array, got', typeof data)
                    this.historicalData = []
                }
            } catch (error) {
                console.warn('Failed to load historical performance data:', error)
                this.historicalData = []
            }
        }
    }

    private async saveHistoricalData(): Promise<void> {
        const dataPath = path.join(this.REPORTS_DIR, 'historical-data.json')
        try {
            // Use async file writing for better performance
            await fs.promises.writeFile(dataPath, JSON.stringify(this.historicalData, null, 2))
        } catch (error) {
            console.warn('Failed to save historical performance data:', error)
        }
    }

    private logResults(
        healthScore: BuildHealthScore,
        regressions: Array<PerformanceRegression>,
        canDeploy: boolean,
    ): void {
        console.log('\n📊 CI/CD Performance Monitoring Results')
        console.log('=====================================')
        console.log(`🏥 Health Score: ${healthScore.overallScore}/100 (Grade: ${healthScore.grade})`)
        console.log(`⚡ Status: ${canDeploy ? '✅ Ready for Deployment' : '❌ Deployment Blocked'}`)
        
        if (regressions.length > 0) {
            console.log(`\n⚠️ Performance Regressions Detected: ${regressions.length}`)
            regressions.forEach(reg => {
                console.log(`   ${reg.severity.toUpperCase()}: ${reg.analysis}`)
            })
        } else {
            console.log('\n✅ No performance regressions detected')
        }
        
        console.log('\n📋 Recommendations:')
        healthScore.recommendations.forEach(rec => {
            console.log(`   • ${rec}`)
        })
        console.log('')
    }
}