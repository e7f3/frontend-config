import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { CIPerformanceMonitoring } from './ciPerformanceMonitoring'
import type {
    BuildPerformanceMetrics,
    BuildHealthScore,
    PerformanceRegression,
    AssetOptimizationRecommendation,
    HistoricalPerformanceData,
    BuildContext,
    CIContext,
    ComprehensivePerformanceReport,
    CIPerformanceReport,
    EnvironmentComparisonReport,
    PerformanceSummary,
    DeploymentRecommendation,
    OptimizationPlan,
    QualityGate,
    Recommendation,
    Bottleneck,
    OptimizationOpportunity,
    RiskAssessment,
    PredictedIssue,
    ExecutiveDashboard,
    ExecutiveActionItem,
    NextStep,
    PerformanceBudget,
    CIPerformanceConfig,
} from '../types/performance'
import { BuildCacheAnalyzer } from '../utils/buildCacheAnalysis'
import { BuildHealthScoring } from '../utils/buildHealthScoring'
import { BundleAnalyzer } from '../utils/bundleAnalysis'
import { EnvironmentPerformanceComparison } from '../utils/environmentPerformanceComparison'

/**
 * Comprehensive performance reporting system.
 */
export class ComprehensivePerformanceReporting {
    private readonly healthScoring: BuildHealthScoring
    private readonly cacheAnalyzer: BuildCacheAnalyzer
    private readonly environmentComparison: EnvironmentPerformanceComparison
    private readonly ciMonitoring: CIPerformanceMonitoring
    private readonly reportsDir: string

    constructor(
        config: {
            budgets?: PerformanceBudget
            cacheDir?: string
            reportsDir?: string
            ciConfig?: CIPerformanceConfig
        } = {}
    ) {
        this.healthScoring = new BuildHealthScoring(config.budgets)
        this.cacheAnalyzer = new BuildCacheAnalyzer(config.cacheDir)
        const budgets = (config.budgets as Record<string, unknown>) || {}
        this.environmentComparison = new EnvironmentPerformanceComparison(budgets)
        this.ciMonitoring = new CIPerformanceMonitoring(config.ciConfig)
        this.reportsDir = config.reportsDir || './performance-reports'

        // Ensure reports directory exists
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true })
        }
    }

    /**
     * Generates comprehensive performance report for a single build.
     * @param metrics - Build performance metrics
     * @param context - Build context information
     * @returns Report path, report data, and performance summary
     */
    public async generateBuildReport(
        metrics: BuildPerformanceMetrics,
        context: BuildContext
    ): Promise<{
        reportPath: string
        report: ComprehensivePerformanceReport
        summary: PerformanceSummary
    }> {
        console.log('📊 Generating comprehensive performance report...')

        // Calculate health score
        const healthScore = this.healthScoring.calculateHealthScore(metrics)

        // Analyze bundle composition
        if (!metrics.bundleAnalysis) {
            throw new Error('Bundle analysis data is required for comprehensive reporting')
        }

        const bundleAnalyzer = new BundleAnalyzer(metrics.bundleAnalysis)
        const bundleAnalysis = bundleAnalyzer.generateDetailedAnalysis()
        const optimizationRecommendations = bundleAnalyzer.generateAssetOptimizationRecommendations()

        // Analyze cache performance
        const cachePerformance = this.cacheAnalyzer.analyzeCachePerformance()
        const cacheOptimizations = this.cacheAnalyzer.generateCacheOptimizations()

        // Detect regressions
        const historicalData = this.loadHistoricalData()
        const regressions = this.healthScoring.detectRegressions(metrics, historicalData)

        // Generate trends
        const trends = this.healthScoring.analyzePerformanceTrends(historicalData)

        // Compile comprehensive report
        const report: ComprehensivePerformanceReport = {
            metadata: {
                reportId: this.generateReportId(),
                timestamp: new Date().toISOString(),
                buildContext: context,
                environment: this.getEnvironmentInfo(),
                reportVersion: '1.0',
            },
            buildMetrics: metrics,
            healthAnalysis: {
                healthScore,
                regressions,
                trends,
                recommendations: healthScore.recommendations,
            },
            bundleAnalysis: {
                detailedAnalysis: bundleAnalysis,
                optimizationRecommendations,
                codeSplittingRecommendations: bundleAnalyzer.generateCodeSplittingRecommendations(),
                dependencyAnalysis: bundleAnalyzer.analyzeBundleComposition().dependencyAnalysis,
                bundleHealthScore: bundleAnalyzer.calculateBundleHealthScore(),
            },
            cacheAnalysis: {
                performance: cachePerformance,
                optimizations: cacheOptimizations,
                memoryUsage: this.cacheAnalyzer.monitorCacheMemoryUsage(),
                comparison: this.cacheAnalyzer.compareCachePerformance(['development', 'production']),
            },
            performanceInsights: {
                bottlenecks: this.identifyBottlenecks(metrics, bundleAnalysis),
                optimizationOpportunities: this.identifyOptimizationOpportunities(bundleAnalysis, cachePerformance),
                riskAssessment: this.assessPerformanceRisks(metrics, regressions),
                predictedIssues: this.predictPerformanceIssues(metrics, trends),
            },
            recommendations: this.generateComprehensiveRecommendations(
                healthScore,
                optimizationRecommendations,
                cacheOptimizations,
                regressions
            ),
            appendices: {
                performanceBudgets: this.getPerformanceBudgets(),
                industryBenchmarks: this.getIndustryBenchmarks(),
                toolingConfiguration: this.getToolingConfiguration(),
            },
        }

        // Generate report files
        const reportPath = await this.saveReport(report)
        const summary = this.generatePerformanceSummary(report)

        console.log(`✅ Comprehensive performance report generated: ${reportPath}`)

        return {
            reportPath,
            report,
            summary,
        }
    }

    /**
     * Generates CI/CD performance report.
     * @param metrics - Build performance metrics
     * @param context - CI context information
     * @returns Report path, report data, and deployment recommendation
     */
    public async generateCIReport(
        metrics: BuildPerformanceMetrics,
        context: CIContext
    ): Promise<{
        reportPath: string
        report: CIPerformanceReport
        deploymentRecommendation: DeploymentRecommendation
    }> {
        console.log('🚀 Generating CI/CD performance report...')

        // Run CI performance monitoring
        const ciResult = await this.ciMonitoring.runCIPerformanceMonitoring(metrics, {
            branch: context.branch,
            commit: context.commit,
            author: context.author,
            buildId: context.buildId,
            isPullRequest: context.isPullRequest,
            pullRequestNumber: context.pullRequestNumber,
            buildNumber: context.buildNumber,
        })

        // Generate detailed CI report
        const report: CIPerformanceReport = {
            metadata: {
                reportId: this.generateReportId(),
                timestamp: new Date().toISOString(),
                ciContext: context,
                pipelineId: context.pipelineId,
            },
            performanceSummary: ciResult.healthScore,
            regressions: ciResult.regressions,
            budgetEnforcement: this.ciMonitoring.enforcePerformanceBudgets(metrics),
            deploymentDecision: {
                canDeploy: ciResult.canDeploy,
                recommendation: this.generateDeploymentRecommendation(ciResult),
                blockingIssues: ciResult.regressions.filter((r) => r.isBlocking),
                warnings: ciResult.regressions.filter((r) => !r.isBlocking),
            },
            performanceTrends: this.ciMonitoring.generatePerformanceTrends(),
            optimizationPlan: this.generateOptimizationPlan(ciResult.healthScore, ciResult.regressions),
            qualityGates: this.evaluateQualityGates(metrics, ciResult.healthScore),
        }

        // Save report
        const reportPath = await this.saveCIReport(report)

        console.log(`✅ CI performance report generated: ${reportPath}`)

        return {
            reportPath,
            report,
            deploymentRecommendation: this.generateDeploymentRecommendation(ciResult),
        }
    }

    /**
     * Generates multi-environment performance comparison report.
     * @returns Report path, report data, and comparison data
     */
    public async generateEnvironmentComparisonReport(): Promise<{
        reportPath: string
        report: EnvironmentComparisonReport
        comparison: Record<string, unknown>
    }> {
        console.log('🌍 Generating environment comparison report...')

        // Load environment data
        await this.loadEnvironmentData()

        // Generate comparison
        const comparison = this.environmentComparison.compareEnvironments()
        const trends = this.environmentComparison.analyzePerformanceTrends()
        const optimizations = this.environmentComparison.generateEnvironmentOptimizations()
        const anomalies = this.environmentComparison.detectPerformanceAnomalies()

        const report: EnvironmentComparisonReport = {
            metadata: {
                reportId: this.generateReportId(),
                timestamp: new Date().toISOString(),
                environments: Array.from(this.environmentComparison['environments'].keys()),
            },
            environmentComparison: comparison,
            performanceTrends: trends,
            optimizationRecommendations: optimizations,
            anomalyDetection: anomalies,
            baselineComparisons: this.environmentComparison.createPerformanceBaselines(),
            recommendations: this.generateEnvironmentRecommendations(comparison),
        }

        const reportPath = await this.saveEnvironmentReport(report)

        console.log(`✅ Environment comparison report generated: ${reportPath}`)

        return {
            reportPath,
            report,
            comparison,
        }
    }

    /**
     * Generates executive dashboard report.
     * @returns Executive dashboard data
     */
    public generateExecutiveDashboard(): ExecutiveDashboard {
        console.log('📈 Generating executive dashboard...')

        const historicalData = this.loadHistoricalData()
        const currentMetrics = historicalData[historicalData.length - 1]?.metrics

        if (!currentMetrics) {
            throw new Error('No historical data available for dashboard generation')
        }

        const healthScore = this.healthScoring.calculateHealthScore(currentMetrics)
        const trends = this.healthScoring.analyzePerformanceTrends(historicalData)

        return {
            keyMetrics: {
                overallHealthScore: healthScore.overallScore,
                buildTimeTrend: trends.trends.buildTime,
                bundleSize: currentMetrics.bundleAnalysis?.totalSize || 0,
                memoryUsage: currentMetrics.peakMemoryUsage || 0,
                lastBuildTime: currentMetrics.totalBuildTime,
            },
            healthOverview: {
                grade: healthScore.grade,
                status: healthScore.status,
                criticalIssues: healthScore.recommendations.filter((r) => r.includes('critical')).length,
                improvementAreas: healthScore.recommendations,
            },
            performanceTrends: {
                direction: trends.direction,
                confidence: trends.confidence,
                keyTrends: trends.trends,
            },
            riskAssessment: this.generateRiskAssessment(currentMetrics, healthScore),
            actionItems: this.generateExecutiveActionItems(healthScore, this.convertTrendsToExecutiveFormat(trends)),
            nextSteps: this.generateNextSteps(healthScore, this.convertTrendsToExecutiveFormat(trends)),
        }
    }

    /**
     * Exports performance data in various formats.
     * @param format - Export format (json, csv, html, pdf)
     * @param data - Performance data to export
     * @param filename - Optional custom filename
     * @returns Path to exported file
     */
    public exportPerformanceData(
        format: 'json' | 'csv' | 'html' | 'pdf',
        data:
            | Record<string, unknown>
            | Array<Record<string, unknown>>
            | ComprehensivePerformanceReport
            | CIPerformanceReport
            | EnvironmentComparisonReport,
        filename?: string
    ): string {
        const exportFilename = filename || `performance-export-${Date.now()}`
        const exportPath = path.join(this.reportsDir, `${exportFilename}.${format}`)

        switch (format) {
            case 'json':
                fs.writeFileSync(exportPath, JSON.stringify(data, null, 2))
                break
            case 'csv':
                if (this.isRecordOrArray(data)) {
                    fs.writeFileSync(exportPath, this.convertToCSV(data as Record<string, unknown> | Array<Record<string, unknown>>))
                } else {
                    throw new Error('CSV export requires record or array data')
                }
                break
            case 'html':
                if (this.isComprehensivePerformanceReport(data)) {
                    fs.writeFileSync(exportPath, this.generateHTMLReport(data))
                } else if (this.isCIPerformanceReport(data)) {
                    fs.writeFileSync(exportPath, this.generateCIHTMLReport(data))
                } else if (this.isEnvironmentComparisonReport(data)) {
                    fs.writeFileSync(exportPath, this.generateEnvironmentHTMLReport(data))
                } else {
                    throw new Error('HTML export requires a valid report type')
                }
                break
            case 'pdf':
                // PDF generation would require additional libraries like puppeteer or jsPDF
                throw new Error('PDF export requires additional dependencies')
        }

        return exportPath
    }

    // Private helper methods

    private saveReport(report: ComprehensivePerformanceReport): string {
        const filename = `comprehensive-report-${report.metadata.reportId}.json`
        const reportPath = path.join(this.reportsDir, filename)

        // Save main report
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

        // Generate and save HTML version
        const htmlPath = reportPath.replace('.json', '.html')
        const htmlContent = this.generateHTMLReport(report)
        fs.writeFileSync(htmlPath, htmlContent)

        // Generate and save summary
        const summaryPath = reportPath.replace('.json', '-summary.json')
        const summary = this.generatePerformanceSummary(report)
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

        return reportPath
    }

    private saveCIReport(report: CIPerformanceReport): string {
        const filename = `ci-report-${report.metadata.reportId}.json`
        const reportPath = path.join(this.reportsDir, filename)

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

        // Generate CI-specific HTML report
        const htmlPath = reportPath.replace('.json', '.html')
        const htmlContent = this.generateCIHTMLReport(report)
        fs.writeFileSync(htmlPath, htmlContent)

        return reportPath
    }

    private saveEnvironmentReport(report: EnvironmentComparisonReport): string {
        const filename = `environment-report-${report.metadata.reportId}.json`
        const reportPath = path.join(this.reportsDir, filename)

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

        // Generate environment comparison HTML
        const htmlPath = reportPath.replace('.json', '.html')
        const htmlContent = this.generateEnvironmentHTMLReport(report)
        fs.writeFileSync(htmlPath, htmlContent)

        return reportPath
    }

    private generateHTMLReport(report: ComprehensivePerformanceReport): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Report - ${report.metadata.buildContext.branch}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .section { padding: 30px; border-bottom: 1px solid #eee; }
        .section:last-child { border-bottom: none; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .score-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white; margin: 0 auto 10px; }
        .score-excellent { background: #28a745; }
        .score-good { background: #17a2b8; }
        .score-fair { background: #ffc107; color: #212529; }
        .score-poor { background: #fd7e14; }
        .score-critical { background: #dc3545; }
        .recommendation { background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0; }
        .regression { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
        .optimization { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .trend-up { color: #dc3545; }
        .trend-down { color: #28a745; }
        .trend-stable { color: #6c757d; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Comprehensive Performance Report</h1>
            <p>Build: ${report.metadata.buildContext.branch} | Commit: ${report.metadata.buildContext.commit.substring(0, 8)} | ${new Date(report.metadata.timestamp).toLocaleString()}</p>
        </div>

        <div class="section">
            <h2>🏥 Build Health Overview</h2>
            <div class="score-circle score-${report.healthAnalysis.healthScore.status}">
                ${report.healthAnalysis.healthScore.overallScore}
            </div>
            <p style="text-align: center; font-size: 18px; font-weight: bold;">
                Grade: ${report.healthAnalysis.healthScore.grade} | Status: ${report.healthAnalysis.healthScore.status.toUpperCase()}
            </p>
        </div>

        <div class="section">
            <h2>⚡ Key Metrics</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h3>Build Time</h3>
                    <p><strong>${this.formatTime(report.buildMetrics.totalBuildTime)}</strong></p>
                    <p class="trend-${report.healthAnalysis.trends.trends.buildTime}">
                        ${report.healthAnalysis.trends.trends.buildTime} (${report.healthAnalysis.trends.changePercentage.toFixed(1)}%)
                    </p>
                </div>
                <div class="metric-card">
                    <h3>Bundle Size</h3>
                    <p><strong>${this.formatSize(report.buildMetrics.bundleAnalysis?.totalSize || 0)}</strong></p>
                    <p class="trend-${report.healthAnalysis.trends.trends.bundleSize}">
                        ${report.healthAnalysis.trends.trends.bundleSize}
                    </p>
                </div>
                <div class="metric-card">
                    <h3>Memory Usage</h3>
                    <p><strong>${this.formatMemory(report.buildMetrics.peakMemoryUsage || 0)}</strong></p>
                    <p class="trend-${report.healthAnalysis.trends.trends.memory}">
                        ${report.healthAnalysis.trends.trends.memory}
                    </p>
                </div>
                <div class="metric-card">
                    <h3>Modules</h3>
                    <p><strong>${report.buildMetrics.moduleCount}</strong></p>
                    <p>Assets: ${report.buildMetrics.assetCount}</p>
                </div>
            </div>
        </div>

        ${
            report.healthAnalysis.regressions.length > 0
                ? `
        <div class="section">
            <h2>⚠️ Performance Regressions</h2>
            ${report.healthAnalysis.regressions
                .map(
                    (reg) => `
                <div class="regression">
                    <h4>${reg.type.toUpperCase()}</h4>
                    <p>${reg.analysis}</p>
                    <p><strong>Impact:</strong> ${reg.percentageChange.toFixed(1)}% increase</p>
                    ${reg.recommendations.map((rec) => `<p>• ${rec}</p>`).join('')}
                </div>
            `
                )
                .join('')}
        </div>
        `
                : ''
        }

        <div class="section">
            <h2>🎯 Optimization Recommendations</h2>
            ${report.recommendations
                .map(
                    (rec) => `
                <div class="optimization">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <p><strong>Priority:</strong> ${rec.priority} | <strong>Impact:</strong> ${rec.estimatedImpact}</p>
                </div>
            `
                )
                .join('')}
        </div>

        <div class="section">
            <h2>💾 Cache Performance</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h3>Hit Rate</h3>
                    <p><strong>${(report.cacheAnalysis.performance.hitRate * 100).toFixed(1)}%</strong></p>
                </div>
                <div class="metric-card">
                    <h3>Time Saved</h3>
                    <p><strong>${this.formatTime(report.cacheAnalysis.performance.timeSaved)}</strong></p>
                </div>
                <div class="metric-card">
                    <h3>Cache Size</h3>
                    <p><strong>${this.formatSize(report.cacheAnalysis.performance.cacheSize)}</strong></p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated by Build Performance Monitoring System | Version ${report.metadata.reportVersion}</p>
        </div>
    </div>
</body>
</html>
        `
    }

    private generateCIHTMLReport(report: CIPerformanceReport): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CI Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: ${report.deploymentDecision.canDeploy ? '#28a745' : '#dc3545'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .status-approved { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; }
        .status-blocked { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; }
        .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .regression { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${report.deploymentDecision.canDeploy ? '✅ DEPLOYMENT APPROVED' : '❌ DEPLOYMENT BLOCKED'}</h1>
            <p>CI Performance Report - ${report.metadata.ciContext.branch}</p>
        </div>

        <div class="metric">
            <h3>Performance Health Score</h3>
            <p><strong>${report.performanceSummary.overallScore}/100</strong> (Grade: ${report.performanceSummary.grade})</p>
        </div>

        ${
            report.deploymentDecision.canDeploy
                ? '<div class="status-approved">✅ All performance checks passed. Deployment is approved.</div>'
                : '<div class="status-blocked">❌ Performance issues detected. Deployment is blocked until resolved.</div>'
        }

        ${
            report.regressions.length > 0
                ? `
            <h3>Performance Regressions</h3>
            ${report.regressions
                .map(
                    (reg) => `
                <div class="regression">
                    <strong>${reg.type}:</strong> ${reg.analysis}
                </div>
            `
                )
                .join('')}
        `
                : ''
        }

        <div class="metric">
            <h3>Quality Gates</h3>
            ${report.qualityGates
                .map(
                    (gate) => `
                <p>${gate.status === 'passed' ? '✅' : '❌'} ${gate.name}: ${gate.status}</p>
            `
                )
                .join('')}
        </div>
    </div>
</body>
</html>
        `
    }

    private generateEnvironmentHTMLReport(report: EnvironmentComparisonReport): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environment Performance Comparison</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .comparison-table th, .comparison-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .comparison-table th { background-color: #f8f9fa; }
        .best { background-color: #d4edda; }
        .worst { background-color: #f8d7da; }
        .rank-1 { background-color: #d1ecf1; }
    </style>
</head>
<body>
    <h1>🌍 Environment Performance Comparison</h1>
    
    <h2>Performance Rankings</h2>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Environment</th>
                <th>Score</th>
                <th>Strengths</th>
                <th>Weaknesses</th>
            </tr>
        </thead>
        <tbody>
            ${(report.environmentComparison.rankings || [])
                .map(
                    (ranking: {
                        rank: number
                        environment: string
                        score: number
                        strengths: Array<string>
                        weaknesses: Array<string>
                    }) => `
                <tr class="rank-${ranking.rank}">
                    <td>${ranking.rank}</td>
                    <td>${ranking.environment}</td>
                    <td>${ranking.score.toFixed(1)}</td>
                    <td>${ranking.strengths.join(', ')}</td>
                    <td>${ranking.weaknesses.join(', ')}</td>
                </tr>
            `
                )
                .join('')}
        </tbody>
    </table>

    <h2>Key Insights</h2>
    <ul>
        <li><strong>Fastest Build:</strong> ${report.environmentComparison.insights.fastestBuild}</li>
        <li><strong>Most Efficient Memory:</strong> ${report.environmentComparison.insights.mostEfficientMemory}</li>
        <li><strong>Best Bundle Optimization:</strong> ${report.environmentComparison.insights.bestBundleOptimization}</li>
    </ul>

    <h2>Recommendations</h2>
    <ul>
        ${(report.environmentComparison.recommendations || []).map((rec: string) => `<li>${rec}</li>`).join('')}
    </ul>
</body>
</html>
        `
    }

    private generatePerformanceSummary(report: ComprehensivePerformanceReport): PerformanceSummary {
        return {
            overallHealthScore: report.healthAnalysis.healthScore.overallScore,
            grade: report.healthAnalysis.healthScore.grade,
            buildTime: report.buildMetrics.totalBuildTime,
            bundleSize: report.buildMetrics.bundleAnalysis?.totalSize || 0,
            memoryUsage: report.buildMetrics.peakMemoryUsage || 0,
            regressionsCount: report.healthAnalysis.regressions.length,
            optimizationOpportunities: report.recommendations.length,
            criticalIssues: report.recommendations.filter((r) => r.priority === 'high').length,
            cacheHitRate: report.cacheAnalysis.performance.hitRate,
            lastUpdated: new Date().toISOString(),
        }
    }

    private generateDeploymentRecommendation(ciResult: {
        canDeploy: boolean
        regressions: Array<PerformanceRegression>
    }): DeploymentRecommendation {
        if (ciResult.canDeploy) {
            return {
                decision: 'approve',
                confidence: 'high',
                reasoning: 'All performance checks passed successfully',
                conditions: [],
            }
        }
        const blockingIssues = ciResult.regressions.filter((r: PerformanceRegression) => r.isBlocking)
        return {
            decision: 'block',
            confidence: 'high',
            reasoning: `Performance regressions detected: ${blockingIssues.length} blocking issues`,
            conditions: blockingIssues.map((issue: PerformanceRegression) => `Resolve ${issue.type}: ${issue.analysis}`),
        }
    }

    private generateOptimizationPlan(healthScore: BuildHealthScore, regressions: Array<PerformanceRegression>): OptimizationPlan {
        const plan = {
            immediate: [] as Array<string>,
            shortTerm: [] as Array<string>,
            longTerm: [] as Array<string>,
        }

        // Add recommendations based on health score
        healthScore.recommendations.forEach((rec) => {
            if (rec.includes('immediately') || rec.includes('urgent')) {
                plan.immediate.push(rec)
            } else if (rec.includes('optimize') || rec.includes('improve')) {
                plan.shortTerm.push(rec)
            } else {
                plan.longTerm.push(rec)
            }
        })

        // Add regression-specific recommendations
        regressions.forEach((reg) => {
            plan.immediate.push(...reg.recommendations)
        })

        return plan
    }

    private evaluateQualityGates(metrics: BuildPerformanceMetrics, healthScore: BuildHealthScore): Array<QualityGate> {
        return [
            {
                name: 'Build Health Score',
                status: healthScore.overallScore >= 70 ? 'passed' : 'failed',
                threshold: 70,
                actual: healthScore.overallScore,
            },
            {
                name: 'Bundle Size',
                status: (metrics.bundleAnalysis?.totalSize || 0) <= 1024 * 1024 ? 'passed' : 'failed',
                threshold: 1024 * 1024,
                actual: metrics.bundleAnalysis?.totalSize || 0,
            },
            {
                name: 'Build Time',
                status: metrics.totalBuildTime <= 30000 ? 'passed' : 'failed',
                threshold: 30000,
                actual: metrics.totalBuildTime,
            },
            {
                name: 'Memory Usage',
                status: (metrics.peakMemoryUsage || 0) <= 1024 ? 'passed' : 'failed',
                threshold: 1024,
                actual: metrics.peakMemoryUsage || 0,
            },
        ]
    }

    private generateComprehensiveRecommendations(
        healthScore: BuildHealthScore,
        bundleRecommendations: Array<AssetOptimizationRecommendation>,
        cacheOptimizations: {
            recommendations: Array<string>
        },
        regressions: Array<PerformanceRegression>
    ): Array<Recommendation> {
        const recommendations: Array<Recommendation> = []

        // Health score recommendations
        healthScore.recommendations.forEach((rec) => {
            recommendations.push({
                title: 'Build Optimization',
                description: rec,
                priority: 'high',
                estimatedImpact: '10-20% performance improvement',
                category: 'build',
            })
        })

        // Bundle optimization recommendations
        bundleRecommendations.slice(0, 5).forEach((rec) => {
            recommendations.push({
                title: `Optimize ${rec.assetName}`,
                description: rec.description,
                priority: rec.priority,
                estimatedImpact: `${this.formatSize(rec.savings)} potential savings`,
                category: 'bundle',
            })
        })

        // Cache optimization recommendations
        cacheOptimizations.recommendations.forEach((rec: string) => {
            recommendations.push({
                title: 'Cache Optimization',
                description: rec,
                priority: 'medium',
                estimatedImpact: '5-15% build time improvement',
                category: 'cache',
            })
        })

        // Regression-specific recommendations
        regressions.forEach((reg) => {
            recommendations.push({
                title: `Fix ${reg.type} Regression`,
                description: reg.analysis,
                priority: reg.severity === 'critical' ? 'high' : 'medium',
                estimatedImpact: `${reg.percentageChange.toFixed(1)}% performance improvement`,
                category: 'regression',
            })
        })

        return recommendations
    }

    private identifyBottlenecks(
        metrics: BuildPerformanceMetrics,
        bundleAnalysis: {
            summary: { totalSize: number }
        }
    ): Array<Bottleneck> {
        const bottlenecks: Array<Bottleneck> = []

        if (metrics.totalBuildTime > 30000) {
            bottlenecks.push({
                type: 'build-time',
                severity: 'high',
                description: 'Build time exceeds recommended threshold',
                impact: 'Slow developer feedback loop',
                location: 'build process',
            })
        }

        if (metrics.peakMemoryUsage && metrics.peakMemoryUsage > 1024) {
            bottlenecks.push({
                type: 'memory',
                severity: 'medium',
                description: 'High memory usage during build',
                impact: 'Potential build failures on memory-constrained systems',
                location: 'build process',
            })
        }

        if (bundleAnalysis.summary.totalSize > 1024 * 1024) {
            bottlenecks.push({
                type: 'bundle-size',
                severity: 'high',
                description: 'Bundle size exceeds recommended threshold',
                impact: 'Slow application startup and large bandwidth usage',
                location: 'bundle composition',
            })
        }

        return bottlenecks
    }

    private identifyOptimizationOpportunities(
        bundleAnalysis: {
            optimization: { totalPotentialSavings: number }
        },
        cachePerformance: {
            hitRate: number
        }
    ): Array<OptimizationOpportunity> {
        const opportunities: Array<OptimizationOpportunity> = []

        if (cachePerformance.hitRate < 0.8) {
            opportunities.push({
                type: 'cache-optimization',
                priority: 'high',
                description: 'Improve cache hit rate',
                estimatedImpact: '20-30% build time reduction',
                effort: 'low',
            })
        }

        if (bundleAnalysis.optimization.totalPotentialSavings > 0) {
            opportunities.push({
                type: 'bundle-optimization',
                priority: 'medium',
                description: 'Optimize bundle composition',
                estimatedImpact: `${this.formatSize(bundleAnalysis.optimization.totalPotentialSavings)} size reduction`,
                effort: 'medium',
            })
        }

        return opportunities
    }

    private assessPerformanceRisks(metrics: BuildPerformanceMetrics, regressions: Array<PerformanceRegression>): RiskAssessment {
        const risks: Array<{
            level: string
            description: string
            mitigation: string
        }> = []

        if (regressions.length > 0) {
            risks.push({
                level: 'high',
                description: 'Performance regressions detected',
                mitigation: 'Address regression causes before deployment',
            })
        }

        if (metrics.totalBuildTime > 45000) {
            risks.push({
                level: 'medium',
                description: 'Build time significantly above average',
                mitigation: 'Optimize build configuration and dependencies',
            })
        }

        return {
            overallRisk: risks.length > 2 ? 'high' : risks.length > 0 ? 'medium' : 'low',
            risks,
            recommendations: risks.map((risk) => risk.mitigation),
        }
    }

    private predictPerformanceIssues(
        _metrics: BuildPerformanceMetrics,
        trends: {
            direction: 'improving' | 'declining' | 'stable'
        }
    ): Array<PredictedIssue> {
        const issues: Array<PredictedIssue> = []

        if (trends.direction === 'declining') {
            issues.push({
                type: 'performance-decline',
                probability: 'high',
                timeframe: 'next few builds',
                description: 'Performance trends show declining performance',
                prevention: 'Implement performance monitoring alerts',
            })
        }

        return issues
    }

    private generateRiskAssessment(_metrics: BuildPerformanceMetrics, healthScore: BuildHealthScore): RiskAssessment {
        const risks: Array<{
            level: string
            description: string
            mitigation: string
        }> = []

        if (healthScore.overallScore < 60) {
            risks.push({
                level: 'high',
                description: 'Low build health score indicates potential issues',
                mitigation: 'Address identified performance issues immediately',
            })
        }

        return {
            overallRisk: healthScore.overallScore < 60 ? 'high' : healthScore.overallScore < 80 ? 'medium' : 'low',
            risks,
            recommendations: healthScore.recommendations,
        }
    }

    private generateExecutiveActionItems(
        healthScore: BuildHealthScore,
        _trends: {
            direction: 'improving' | 'declining' | 'stable'
            changePercentage: number
            confidence: number
            trends: {
                buildTime: 'improving' | 'declining' | 'stable'
                bundleSize: 'improving' | 'declining' | 'stable'
                memory: 'improving' | 'declining' | 'stable'
                overall: 'improving' | 'declining' | 'stable'
            }
        }
    ): Array<ExecutiveActionItem> {
        // trends parameter is intentionally unused but kept for API compatibility
        return [
            {
                priority: 'high',
                title: 'Address Critical Performance Issues',
                description: healthScore.overallScore < 60 ? 'Immediate action required' : 'Monitor closely',
                owner: 'Engineering Team',
                timeline: healthScore.overallScore < 60 ? 'This sprint' : 'Next sprint',
                impact: 'Critical',
            },
            {
                priority: 'medium',
                title: 'Optimize Build Performance',
                description: 'Implement identified optimization recommendations',
                owner: 'DevOps Team',
                timeline: 'Next sprint',
                impact: 'High',
            },
        ]
    }

    private generateNextSteps(
        healthScore: BuildHealthScore,
        _trends: {
            direction: 'improving' | 'declining' | 'stable'
            changePercentage: number
            confidence: number
            trends: {
                buildTime: 'improving' | 'declining' | 'stable'
                bundleSize: 'improving' | 'declining' | 'stable'
                memory: 'improving' | 'declining' | 'stable'
                overall: 'improving' | 'declining' | 'stable'
            }
        }
    ): Array<NextStep> {
        return [
            {
                step: 'Immediate',
                action: healthScore.overallScore < 70 ? 'Address performance regressions' : 'Continue monitoring',
                timeline: '1-2 days',
            },
            {
                step: 'Short-term',
                action: 'Implement optimization recommendations',
                timeline: '1-2 weeks',
            },
            {
                step: 'Long-term',
                action: 'Establish performance monitoring and alerting',
                timeline: '1 month',
            },
        ]
    }

    private generateEnvironmentRecommendations(comparison: { recommendations?: Array<string> }): Array<string> {
        return comparison.recommendations || []
    }

    private generateReportId(): string {
        return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    private getEnvironmentInfo(): {
        nodeVersion: string
        platform: string
        arch: string
        cpus: number
        memory: number
        hostname: string
    } {
        return {
            nodeVersion: process.version,
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            memory: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
            hostname: os.hostname(),
        }
    }

    private loadHistoricalData(): Array<HistoricalPerformanceData> {
        const dataPath = path.join(this.reportsDir, 'historical-data.json')
        if (fs.existsSync(dataPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
                // Validate that loaded data is an array before returning
                if (Array.isArray(data)) {
                    return data
                }
                console.warn('Invalid historical data format: expected array, got', typeof data)
                return []
            } catch (error) {
                console.warn('Failed to load historical data:', error)
                return []
            }
        }
        return []
    }

    private async loadEnvironmentData(): Promise<void> {
        try {
            // Define potential environment data sources
            const environmentDataSources = [
                path.join(this.reportsDir, 'environment-data.json'),
                path.join(process.cwd(), '.performance', 'environment-data.json'),
                path.join(process.cwd(), 'config', 'environments.json'),
            ]

            let environmentDataLoaded = false

            // Try to load environment data from each potential source
            for (const dataSource of environmentDataSources) {
                if (fs.existsSync(dataSource)) {
                    try {
                        const rawData = fs.readFileSync(dataSource, 'utf-8')
                        const environmentData = JSON.parse(rawData)

                        // Process and add each environment's data
                        Object.entries(environmentData).forEach(([env, data]) => {
                            if (data && typeof data === 'object') {
                                this.environmentComparison.addEnvironmentData(env, data as Record<string, unknown>)
                            } else {
                                console.warn(`Invalid environment data for '${env}': expected object, got`, typeof data)
                            }
                        })

                        console.log(`✅ Loaded environment data from: ${dataSource}`)
                        environmentDataLoaded = true
                        break // Stop after successfully loading from one source
                    } catch (parseError) {
                        console.warn(`⚠️ Failed to parse environment data from ${dataSource}:`, parseError)
                    }
                }
            }

            // If no environment data was found, try to generate it from existing reports
            if (!environmentDataLoaded) {
                await this.generateEnvironmentDataFromReports()
            }

            // As a fallback, add minimal environment data based on current system
            if (!environmentDataLoaded) {
                this.addMinimalEnvironmentData()
            }
        } catch (error) {
            console.error('❌ Error loading environment data:', error)
            // Add minimal data as a fallback
            this.addMinimalEnvironmentData()
        }
    }

    private generateEnvironmentDataFromReports(): void {
        try {
            // Look for existing performance reports in the reports directory
            const reportFiles = fs.readdirSync(this.reportsDir).filter((file) => file.endsWith('.json') && file.includes('report-'))

            if (reportFiles.length === 0) {
                return
            }

            // Group reports by environment (if identifiable from filename or content)
            const environmentGroups: Record<string, Array<any>> = {}

            for (const reportFile of reportFiles.slice(-10)) {
                // Process last 10 reports
                try {
                    const reportPath = path.join(this.reportsDir, reportFile)
                    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

                    // Try to determine environment from report metadata
                    let environment = 'unknown'
                    const { metadata } = reportData
                    const { buildContext } = metadata || {}
                    const { environment: envName } = buildContext || {}

                    if (envName) {
                        environment = envName
                    } else if (reportFile.includes('production')) {
                        environment = 'production'
                    } else if (reportFile.includes('development') || reportFile.includes('dev')) {
                        environment = 'development'
                    } else if (reportFile.includes('staging')) {
                        environment = 'staging'
                    }

                    if (!environmentGroups[environment]) {
                        environmentGroups[environment] = []
                    }

                    environmentGroups[environment]!.push({
                        metrics: reportData.buildMetrics,
                        healthScore: reportData.healthAnalysis?.healthScore,
                        timestamp: metadata?.timestamp,
                    })
                } catch (parseError) {
                    console.warn(`⚠️ Failed to parse report ${reportFile}:`, parseError)
                }
            }

            // Add aggregated environment data
            Object.entries(environmentGroups).forEach(([env, reports]) => {
                if (reports && reports.length > 0) {
                    // Calculate averages for metrics
                    const avgMetrics = this.calculateAverageMetrics(reports)
                    const avgHealthScore = this.calculateAverageHealthScore(reports)

                    this.environmentComparison.addEnvironmentData(env, {
                        metrics: avgMetrics as BuildPerformanceMetrics,
                        healthScore: avgHealthScore as BuildHealthScore,
                    })

                    console.log(`✅ Generated environment data for '${env}' from ${reports.length} reports`)
                }
            })
        } catch (error) {
            console.warn('⚠️ Failed to generate environment data from reports:', error)
        }
    }

    private calculateAverageMetrics(reports: Array<any>): Record<string, any> {
        const validReports = reports.filter((r) => r.metrics)
        if (validReports.length === 0) return {}

        const totals = validReports.reduce<Record<string, number>>(
            (acc, report) => {
                const { metrics } = report
                acc.totalBuildTime = (acc.totalBuildTime || 0) + (metrics.totalBuildTime || 0)
                acc.peakMemoryUsage = (acc.peakMemoryUsage || 0) + (metrics.peakMemoryUsage || 0)
                acc.moduleCount = (acc.moduleCount || 0) + (metrics.moduleCount || 0)
                acc.assetCount = (acc.assetCount || 0) + (metrics.assetCount || 0)

                if (metrics.bundleAnalysis) {
                    acc.bundleSize = (acc.bundleSize || 0) + (metrics.bundleAnalysis.totalSize || 0)
                }

                return acc
            },
            { totalBuildTime: 0, peakMemoryUsage: 0, moduleCount: 0, assetCount: 0, bundleSize: 0 }
        )

        const count = validReports.length
        return {
            totalBuildTime: Math.round((totals.totalBuildTime || 0) / count),
            peakMemoryUsage: Math.round((totals.peakMemoryUsage || 0) / count),
            moduleCount: Math.round((totals.moduleCount || 0) / count),
            assetCount: Math.round((totals.assetCount || 0) / count),
            bundleAnalysis: {
                totalSize: Math.round((totals.bundleSize || 0) / count),
            },
        }
    }

    private calculateAverageHealthScore(reports: Array<any>): Record<string, any> {
        const validReports = reports.filter((r) => r.healthScore)
        if (validReports.length === 0) return {}

        const totals = validReports.reduce<Record<string, number>>(
            (acc, report) => {
                const { healthScore } = report
                acc.overallScore = (acc.overallScore || 0) + (healthScore.overallScore || 0)
                return acc
            },
            { overallScore: 0 }
        )

        const avgScore = Math.round((totals.overallScore || 0) / validReports.length)

        // Determine grade based on average score
        let grade = 'F'
        if (avgScore >= 90) grade = 'A'
        else if (avgScore >= 80) grade = 'B'
        else if (avgScore >= 70) grade = 'C'
        else if (avgScore >= 60) grade = 'D'

        return {
            overallScore: avgScore,
            grade,
        }
    }

    private addMinimalEnvironmentData(): void {
        // Add minimal environment data based on current system information
        const envInfo = this.getEnvironmentInfo()

        // Create a basic environment profile based on current system
        const basicEnvData = {
            metrics: {
                totalBuildTime: 20000, // Default estimate
                compilationTime: 10000, // Default estimate
                emitTime: 5000, // Default estimate
                optimizationTime: 3000, // Default estimate
                moduleResolutionTime: 2000, // Default estimate
                chunkGenerationTime: 2000, // Default estimate
                peakMemoryUsage: Math.min(envInfo.memory * 0.5, 1024), // Estimate based on system memory
                moduleCount: 500, // Default estimate
                chunkCount: 10, // Default estimate
                assetCount: 50, // Default estimate
                bundleAnalysis: {
                    totalSize: 500000, // Default estimate
                    gzippedSize: 150000, // Default estimate
                    assets: [], // Empty array
                    modules: [], // Empty array
                    chunks: [], // Empty array
                    vendorSize: 200000, // Default estimate
                    appSize: 300000, // Default estimate
                    commonSize: 50000, // Default estimate
                },
                webpackVersion: '5.x', // Default
                nodeVersion: envInfo.nodeVersion,
                timestamp: new Date().toISOString(),
                environment: 'current',
                performanceHints: [], // Empty array
            },
            healthScore: {
                overallScore: 75, // Default score
                buildTimeScore: 70,
                bundleSizeScore: 75,
                performanceScore: 80,
                cacheScore: 70,
                memoryScore: 75,
                grade: 'C' as const,
                status: 'fair' as const,
                recommendations: ['Consider optimizing build configuration'],
            },
            systemInfo: envInfo,
        }

        // Add as 'current' environment
        this.environmentComparison.addEnvironmentData('current', basicEnvData)
        console.log('✅ Added minimal environment data based on current system')
    }

    private convertToCSV(data: Record<string, unknown> | Array<Record<string, unknown>>): string {
        // Handle array of objects
        if (Array.isArray(data)) {
            if (data.length === 0) return ''

            // Get all possible keys from all objects
            const allKeys = new Set<string>()
            data.forEach((item) => {
                if (item && typeof item === 'object') {
                    Object.keys(item).forEach((key) => allKeys.add(key))
                }
            })

            const headers = Array.from(allKeys)
            const rows = data.map((item) => {
                return headers
                    .map((header) => {
                        const value = item?.[header]
                        return this.formatCSVValue(value)
                    })
                    .join(',')
            })

            return [headers.join(','), ...rows].join('\n')
        }

        // Handle single object
        if (data && typeof data === 'object') {
            const headers = Object.keys(data)
            const row = headers
                .map((header) => {
                    const value = data[header]
                    return this.formatCSVValue(value)
                })
                .join(',')

            return [headers.join(','), row].join('\n')
        }

        // Handle primitive values
        return this.formatCSVValue(data)
    }

    private formatCSVValue(value: unknown): string {
        if (value === null || value === undefined) {
            return ''
        }

        // Handle arrays
        if (Array.isArray(value)) {
            // Convert array to JSON string and escape quotes
            const jsonString = JSON.stringify(value)
            return `"${jsonString.replace(/"/g, '""')}"`
        }

        // Handle objects
        if (typeof value === 'object') {
            // Convert object to JSON string and escape quotes
            const jsonString = JSON.stringify(value)
            return `"${jsonString.replace(/"/g, '""')}"`
        }

        // Handle strings with commas, quotes, or newlines
        if (typeof value === 'string') {
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`
            }
            return value
        }

        // Handle numbers and booleans
        return String(value)
    }

    private getPerformanceBudgets(): {
        bundleSize: string
        buildTime: string
        memoryUsage: string
        performanceScore: string
    } {
        return {
            bundleSize: '1MB',
            buildTime: '30s',
            memoryUsage: '1GB',
            performanceScore: '80/100',
        }
    }

    private getIndustryBenchmarks(): {
        bundleSize: { good: string; acceptable: string; poor: string }
        buildTime: { good: string; acceptable: string; poor: string }
        memoryUsage: { good: string; acceptable: string; poor: string }
    } {
        return {
            bundleSize: { good: '< 500KB', acceptable: '< 1MB', poor: '> 1MB' },
            buildTime: { good: '< 15s', acceptable: '< 30s', poor: '> 45s' },
            memoryUsage: { good: '< 1GB', acceptable: '< 1.5GB', poor: '> 2GB' },
        }
    }

    private getToolingConfiguration(): {
        webpack: string
        typescript: string
        node: string
        monitoring: string
    } {
        return {
            webpack: '5.x',
            typescript: '5.x',
            node: '18.x',
            monitoring: 'comprehensive-performance-monitoring v1.0',
        }
    }

    private formatTime(milliseconds: number): string {
        if (milliseconds < 1000) {
            return `${milliseconds}ms`
        }
        return `${(milliseconds / 1000).toFixed(1)}s`
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

    private formatMemory(mb: number): string {
        if (mb < 1024) {
            return `${mb.toFixed(0)}MB`
        }
        return `${(mb / 1024).toFixed(1)}GB`
    }

    // Type guard functions
    private isComprehensivePerformanceReport(data: unknown): data is ComprehensivePerformanceReport {
        return (
            typeof data === 'object' &&
            data !== null &&
            'metadata' in data &&
            'buildMetrics' in data &&
            'healthAnalysis' in data &&
            'bundleAnalysis' in data &&
            'cacheAnalysis' in data &&
            'performanceInsights' in data &&
            'recommendations' in data &&
            'appendices' in data
        )
    }

    private isCIPerformanceReport(data: unknown): data is CIPerformanceReport {
        return (
            typeof data === 'object' &&
            data !== null &&
            'metadata' in data &&
            'performanceSummary' in data &&
            'regressions' in data &&
            'budgetEnforcement' in data &&
            'deploymentDecision' in data &&
            'performanceTrends' in data &&
            'optimizationPlan' in data &&
            'qualityGates' in data
        )
    }

    private isEnvironmentComparisonReport(data: unknown): data is EnvironmentComparisonReport {
        return (
            typeof data === 'object' &&
            data !== null &&
            'metadata' in data &&
            'environmentComparison' in data &&
            'performanceTrends' in data &&
            'optimizationRecommendations' in data &&
            'anomalyDetection' in data &&
            'baselineComparisons' in data &&
            'recommendations' in data
        )
    }

    // Helper method to convert trends to executive format
    private convertTrendsToExecutiveFormat(trends: {
        direction: 'improving' | 'declining' | 'stable'
        changePercentage: number
        confidence: number
        trends: {
            buildTime: 'improving' | 'declining' | 'stable'
            bundleSize: 'improving' | 'declining' | 'stable'
            memory: 'improving' | 'declining' | 'stable'
            overall?: 'improving' | 'declining' | 'stable'
        }
    }): {
        direction: 'improving' | 'declining' | 'stable'
        changePercentage: number
        confidence: number
        trends: {
            buildTime: 'improving' | 'declining' | 'stable'
            bundleSize: 'improving' | 'declining' | 'stable'
            memory: 'improving' | 'declining' | 'stable'
            overall: 'improving' | 'declining' | 'stable'
        }
    } {
        return {
            ...trends,
            trends: {
                ...trends.trends,
                overall: trends.trends.overall || trends.direction,
            },
        }
    }

    // Helper method to check if data is a record or array
    private isRecordOrArray(data: unknown): data is Record<string, unknown> | Array<Record<string, unknown>> {
        return (typeof data === 'object' && data !== null) || Array.isArray(data)
    }
}
