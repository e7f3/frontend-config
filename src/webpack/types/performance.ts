import type { Configuration } from 'webpack'

/**
 * Build performance metrics collected during webpack build.
 */
export interface BuildPerformanceMetrics {
    /** Total build time in milliseconds */
    totalBuildTime: number
    /** Time spent on compilation */
    compilationTime: number
    /** Time spent on emit phase */
    emitTime: number
    /** Time spent on optimization */
    optimizationTime: number
    /** Time spent on module resolution */
    moduleResolutionTime: number
    /** Time spent on chunk generation */
    chunkGenerationTime: number
    /** Peak memory usage during build in MB */
    peakMemoryUsage: number
    /** Number of modules processed */
    moduleCount: number
    /** Number of chunks created */
    chunkCount: number
    /** Number of assets generated */
    assetCount: number
    /** Bundle size analysis */
    bundleAnalysis: BundleAnalysis
    /** Webpack version used */
    webpackVersion: string
    /** Node version */
    nodeVersion: string
    /** Build timestamp */
    timestamp: string
    /** Environment (development/production) */
    environment: string
    /** Performance hints results */
    performanceHints: Array<PerformanceHint>
}

/**
 * Bundle size analysis and composition.
 */
export interface BundleAnalysis {
    /** Total bundle size in bytes */
    totalSize: number
    /** Gzipped bundle size in bytes */
    gzippedSize: number
    /** Individual asset sizes */
    assets: Array<AssetAnalysis>
    /** Module size breakdown */
    modules: Array<ModuleAnalysis>
    /** Chunk analysis */
    chunks: Array<ChunkAnalysis>
    /** Vendor bundle size */
    vendorSize: number
    /** App bundle size */
    appSize: number
    /** Common bundle size */
    commonSize: number
}

/**
 * Individual asset analysis.
 */
export interface AssetAnalysis {
    /** Asset name */
    name: string
    /** Asset type (js, css, etc.) */
    type: string
    /** Asset size in bytes */
    size: number
    /** Gzipped size in bytes */
    gzippedSize: number
    /** Percentage of total bundle size */
    percentage: number
    /** Whether asset exceeds performance budget */
    exceedsBudget: boolean
}

/**
 * Module analysis for bundle composition.
 */
export interface ModuleAnalysis {
    /** Module name or identifier */
    name: string
    /** Module path */
    path: string
    /** Module size in bytes */
    size: number
    /** Module type */
    type: string
    /** Whether module is from node_modules */
    isVendor: boolean
    /** Module category for grouping */
    category: 'vendor' | 'app' | 'shared' | 'other'
}

/**
 * Chunk analysis for code splitting.
 */
export interface ChunkAnalysis {
    /** Chunk name */
    name: string
    /** Chunk size in bytes */
    size: number
    /** Gzipped size in bytes */
    gzippedSize: number
    /** Number of modules in chunk */
    moduleCount: number
    /** Chunk type (initial, async, etc.) */
    type: 'initial' | 'async' | 'all' | 'single'
    /** Whether chunk is duplicated */
    isDuplicated: boolean
}

/**
 * Performance hint and recommendations.
 */
export interface PerformanceHint {
    /** Hint type */
    type: 'asset-size' | 'module-size' | 'chunk-size' | 'hints'
    /** Severity level */
    severity: 'warning' | 'error' | 'info'
    /** Hint message */
    message: string
    /** Recommended action */
    recommendation?: string
    /** Performance budget for this metric */
    budget?: number
    /** Actual value */
    actual?: number
    /** Performance score (0-100) */
    score?: number
}

/**
 * Build health score and status.
 */
export interface BuildHealthScore {
    /** Overall health score (0-100) */
    overallScore: number
    /** Build time score */
    buildTimeScore: number
    /** Bundle size score */
    bundleSizeScore: number
    /** Performance score */
    performanceScore: number
    /** Cache efficiency score */
    cacheScore: number
    /** Memory usage score */
    memoryScore: number
    /** Grade (A-F) */
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
    /** Status summary */
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    /** Improvement recommendations */
    recommendations: Array<string>
}

/**
 * Performance regression detection.
 */
export interface PerformanceRegression {
    /** Regression type */
    type: 'build-time' | 'bundle-size' | 'memory' | 'performance'
    /** Current value */
    currentValue: number
    /** Previous value */
    previousValue: number
    /** Percentage change */
    percentageChange: number
    /** Regression severity */
    severity: 'minor' | 'major' | 'critical'
    /** Whether this is a blocking regression */
    isBlocking: boolean
    /** Detailed analysis */
    analysis: string
    /** Recommended actions */
    recommendations: Array<string>
}

/**
 * Historical performance data.
 */
export interface HistoricalPerformanceData {
    /** Build ID or commit hash */
    buildId: string
    /** Commit information */
    commit: {
        hash: string
        message: string
        author: string
        timestamp: string
        branch: string
    }
    /** Performance metrics */
    metrics: BuildPerformanceMetrics
    /** Build health score */
    healthScore: BuildHealthScore
    /** Performance trends */
    trends: {
        /** Trend direction */
        direction: 'improving' | 'declining' | 'stable'
        /** Percentage change from baseline */
        changePercentage: number
        /** Trend confidence (0-1) */
        confidence: number
    }
}

/**
 * Performance budget configuration.
 */
export interface PerformanceBudget {
    /** Bundle size budget in bytes */
    bundleSize?: number
    /** Gzipped bundle size budget in bytes */
    gzippedSize?: number
    /** Build time budget in milliseconds */
    buildTime?: number
    /** Memory usage budget in MB */
    memoryUsage?: number
    /** Module count budget */
    moduleCount?: number
    /** Asset count budget */
    assetCount?: number
    /** Chunk count budget */
    chunkCount?: number
    /** Performance score budget */
    performanceScore?: number
    /** Custom budgets for specific assets */
    customBudgets?: Record<string, number>
}

/**
 * Build cache performance analysis.
 */
export interface CachePerformance {
    /** Cache hit rate (0-1) */
    hitRate: number
    /** Number of cache hits */
    hits: number
    /** Number of cache misses */
    misses: number
    /** Cache effectiveness score (0-100) */
    effectivenessScore: number
    /** Time saved by cache in milliseconds */
    timeSaved: number
    /** Cache directory size */
    cacheSize: number
    /** Number of cached modules */
    cachedModules: number
}

/**
 * Asset optimization recommendations.
 */
export interface AssetOptimizationRecommendation {
    /** Asset name */
    assetName: string
    /** Current size */
    currentSize: number
    /** Estimated optimized size */
    optimizedSize: number
    /** Potential savings */
    savings: number
    /** Recommendation type */
    type: 'compress' | 'split' | 'lazy-load' | 'tree-shake' | 'vendor-split'
    /** Priority level */
    priority: 'high' | 'medium' | 'low'
    /** Detailed description */
    description: string
    /** Implementation difficulty */
    difficulty: 'easy' | 'medium' | 'hard'
    /** Estimated implementation time */
    implementationTime: string
}

/**
 * CI/CD performance monitoring configuration.
 */
export interface CIPerformanceConfig {
    /** Enable performance testing in CI */
    enabled: boolean
    /** Performance budgets for CI */
    budgets: PerformanceBudget
    /** Regression thresholds */
    regressionThresholds: {
        /** Maximum allowed regression percentage */
        maxRegressionPercent: number
        /** Whether to fail on performance regressions */
        failOnRegression: boolean
        /** Whether to block deployments on critical regressions */
        blockOnCritical: boolean
    }
    /** Performance trend analysis */
    trendAnalysis: {
        /** Number of builds to analyze for trends */
        lookbackBuilds: number
        /** Minimum trend confidence to consider significant */
        minConfidence: number
    }
    /** Reporting configuration */
    reporting: {
        /** Enable detailed reports */
        detailedReports: boolean
        /** Enable trend charts */
        trendCharts: boolean
        /** Enable performance comparison */
        enableComparison: boolean
    }
}

/**
 * Build monitoring configuration.
 */
export interface BuildMonitoringConfig {
    /** Enable detailed performance monitoring */
    enableDetailedMonitoring: boolean
    /** Enable memory profiling */
    enableMemoryProfiling: boolean
    /** Enable cache analysis */
    enableCacheAnalysis: boolean
    /** Enable asset optimization recommendations */
    enableOptimizationRecommendations: boolean
    /** Performance budgets */
    budgets: PerformanceBudget
    /** Historical data retention (in days) */
    historicalDataRetention: number
    /** Enable real-time monitoring */
    enableRealTimeMonitoring: boolean
    /** Custom performance plugins configuration */
    customPlugins?: Configuration['plugins']
}

/**
 * Webpack performance plugin options.
 */
export interface PerformancePluginOptions {
    /** Enable detailed timing measurements */
    enableTimings: boolean
    /** Enable memory profiling */
    enableMemoryProfiling: boolean
    /** Enable cache analysis */
    enableCacheAnalysis: boolean
    /** Custom threshold for warnings */
    warningThreshold?: number
    /** Custom threshold for errors */
    errorThreshold?: number
    /** Output format for reports */
    outputFormat: 'json' | 'html' | 'console' | 'all'
    /** Output directory for reports */
    outputDir: string
    /** Enable real-time reporting */
    enableRealTimeReporting: boolean
}

/**
 * Build context information for performance reporting.
 */
export interface BuildContext {
    /** Git branch name */
    branch: string
    /** Git commit hash */
    commit: string
    /** Commit author */
    author: string
    /** Unique build identifier */
    buildId?: string
    /** Build timestamp */
    timestamp?: string
}

/**
 * CI/CD context information for performance reporting.
 */
export interface CIContext {
    /** Git branch name */
    branch: string
    /** Git commit hash */
    commit: string
    /** Commit author */
    author: string
    /** Unique build identifier */
    buildId: string
    /** Whether this is a pull request build */
    isPullRequest: boolean
    /** Pull request number (if applicable) */
    pullRequestNumber?: number
    /** CI build number */
    buildNumber?: number
    /** CI pipeline identifier */
    pipelineId?: string
}

/**
 * Comprehensive performance report structure.
 */
export interface ComprehensivePerformanceReport {
    /** Report metadata */
    metadata: {
        /** Unique report identifier */
        reportId: string
        /** Report generation timestamp */
        timestamp: string
        /** Build context information */
        buildContext: BuildContext
        /** Environment information */
        environment: any
        /** Report version */
        reportVersion: string
    }
    /** Build performance metrics */
    buildMetrics: BuildPerformanceMetrics
    /** Health analysis results */
    healthAnalysis: {
        /** Overall health score */
        healthScore: BuildHealthScore
        /** Detected performance regressions */
        regressions: Array<PerformanceRegression>
        /** Performance trends analysis */
        trends: any
        /** Health recommendations */
        recommendations: Array<string>
    }
    /** Bundle analysis results */
    bundleAnalysis: {
        /** Detailed bundle analysis */
        detailedAnalysis: any
        /** Asset optimization recommendations */
        optimizationRecommendations: Array<AssetOptimizationRecommendation>
        /** Code splitting recommendations */
        codeSplittingRecommendations: Array<any>
        /** Dependency analysis */
        dependencyAnalysis: any
        /** Bundle health score */
        bundleHealthScore: any
    }
    /** Cache analysis results */
    cacheAnalysis: {
        /** Cache performance metrics */
        performance: any
        /** Cache optimization recommendations */
        optimizations: any
        /** Memory usage analysis */
        memoryUsage: any
        /** Cache performance comparison */
        comparison: any
    }
    /** Performance insights */
    performanceInsights: {
        /** Identified bottlenecks */
        bottlenecks: Array<Bottleneck>
        /** Optimization opportunities */
        optimizationOpportunities: Array<OptimizationOpportunity>
        /** Risk assessment */
        riskAssessment: RiskAssessment
        /** Predicted performance issues */
        predictedIssues: Array<PredictedIssue>
    }
    /** Comprehensive recommendations */
    recommendations: Array<Recommendation>
    /** Report appendices */
    appendices: {
        /** Performance budgets */
        performanceBudgets: any
        /** Industry benchmarks */
        industryBenchmarks: any
        /** Tooling configuration */
        toolingConfiguration: any
    }
}

/**
 * CI/CD performance report structure.
 */
export interface CIPerformanceReport {
    /** Report metadata */
    metadata: {
        /** Unique report identifier */
        reportId: string
        /** Report generation timestamp */
        timestamp: string
        /** CI context information */
        ciContext: CIContext
        /** CI pipeline identifier */
        pipelineId?: string
    }
    /** Performance summary */
    performanceSummary: BuildHealthScore
    /** Detected regressions */
    regressions: Array<PerformanceRegression>
    /** Budget enforcement results */
    budgetEnforcement: any
    /** Deployment decision */
    deploymentDecision: {
        /** Whether deployment is approved */
        canDeploy: boolean
        /** Deployment recommendation */
        recommendation: DeploymentRecommendation
        /** Blocking issues */
        blockingIssues: Array<PerformanceRegression>
        /** Non-blocking warnings */
        warnings: Array<PerformanceRegression>
    }
    /** Performance trends */
    performanceTrends: any
    /** Optimization plan */
    optimizationPlan: OptimizationPlan
    /** Quality gate results */
    qualityGates: Array<QualityGate>
}

/**
 * Environment comparison report structure.
 */
export interface EnvironmentComparisonReport {
    /** Report metadata */
    metadata: {
        /** Unique report identifier */
        reportId: string
        /** Report generation timestamp */
        timestamp: string
        /** Compared environments */
        environments: Array<string>
    }
    /** Environment comparison results */
    environmentComparison: any
    /** Performance trends */
    performanceTrends: any
    /** Optimization recommendations */
    optimizationRecommendations: any
    /** Anomaly detection results */
    anomalyDetection: any
    /** Baseline comparisons */
    baselineComparisons: any
    /** Environment-specific recommendations */
    recommendations: Array<string>
}

/**
 * Performance summary structure.
 */
export interface PerformanceSummary {
    /** Overall health score */
    overallHealthScore: number
    /** Performance grade */
    grade: string
    /** Build time in milliseconds */
    buildTime: number
    /** Bundle size in bytes */
    bundleSize: number
    /** Memory usage in MB */
    memoryUsage: number
    /** Number of regressions */
    regressionsCount: number
    /** Number of optimization opportunities */
    optimizationOpportunities: number
    /** Number of critical issues */
    criticalIssues: number
    /** Cache hit rate (0-1) */
    cacheHitRate: number
    /** Last update timestamp */
    lastUpdated: string
}

/**
 * Deployment recommendation structure.
 */
export interface DeploymentRecommendation {
    /** Deployment decision */
    decision: 'approve' | 'block'
    /** Confidence level */
    confidence: 'high' | 'medium' | 'low'
    /** Reasoning for the decision */
    reasoning: string
    /** Conditions for deployment */
    conditions: Array<string>
}

/**
 * Optimization plan structure.
 */
export interface OptimizationPlan {
    /** Immediate actions */
    immediate: Array<string>
    /** Short-term actions */
    shortTerm: Array<string>
    /** Long-term actions */
    longTerm: Array<string>
}

/**
 * Quality gate structure.
 */
export interface QualityGate {
    /** Gate name */
    name: string
    /** Gate status */
    status: 'passed' | 'failed'
    /** Threshold value */
    threshold: number
    /** Actual value */
    actual: number
}

/**
 * Recommendation structure.
 */
export interface Recommendation {
    /** Recommendation title */
    title: string
    /** Detailed description */
    description: string
    /** Priority level */
    priority: 'high' | 'medium' | 'low'
    /** Estimated impact */
    estimatedImpact: string
    /** Recommendation category */
    category: string
}

/**
 * Bottleneck structure.
 */
export interface Bottleneck {
    /** Bottleneck type */
    type: string
    /** Severity level */
    severity: 'high' | 'medium' | 'low'
    /** Detailed description */
    description: string
    /** Impact description */
    impact: string
    /** Location of bottleneck */
    location: string
}

/**
 * Optimization opportunity structure.
 */
export interface OptimizationOpportunity {
    /** Opportunity type */
    type: string
    /** Priority level */
    priority: 'high' | 'medium' | 'low'
    /** Detailed description */
    description: string
    /** Estimated impact */
    estimatedImpact: string
    /** Implementation effort */
    effort: 'low' | 'medium' | 'high'
}

/**
 * Risk assessment structure.
 */
export interface RiskAssessment {
    /** Overall risk level */
    overallRisk: 'high' | 'medium' | 'low'
    /** Individual risks */
    risks: Array<{
        /** Risk level */
        level: string
        /** Risk description */
        description: string
        /** Mitigation strategy */
        mitigation: string
    }>
    /** Risk recommendations */
    recommendations: Array<string>
}

/**
 * Predicted issue structure.
 */
export interface PredictedIssue {
    /** Issue type */
    type: string
    /** Probability of occurrence */
    probability: string
    /** Expected timeframe */
    timeframe: string
    /** Issue description */
    description: string
    /** Prevention strategy */
    prevention: string
}

/**
 * Executive dashboard structure.
 */
export interface ExecutiveDashboard {
    /** Key performance metrics */
    keyMetrics: {
        /** Overall health score */
        overallHealthScore: number
        /** Build time trend */
        buildTimeTrend: any
        /** Bundle size in bytes */
        bundleSize: number
        /** Memory usage in MB */
        memoryUsage: number
        /** Last build time in milliseconds */
        lastBuildTime: number
    }
    /** Health overview */
    healthOverview: {
        /** Performance grade */
        grade: string
        /** Performance status */
        status: string
        /** Number of critical issues */
        criticalIssues: number
        /** Areas for improvement */
        improvementAreas: Array<string>
    }
    /** Performance trends */
    performanceTrends: {
        /** Trend direction */
        direction: string
        /** Trend confidence */
        confidence: number
        /** Key trends */
        keyTrends: any
    }
    /** Risk assessment */
    riskAssessment: RiskAssessment
    /** Executive action items */
    actionItems: Array<ExecutiveActionItem>
    /** Next steps */
    nextSteps: Array<NextStep>
}

/**
 * Executive action item structure.
 */
export interface ExecutiveActionItem {
    /** Priority level */
    priority: 'high' | 'medium' | 'low'
    /** Action title */
    title: string
    /** Action description */
    description: string
    /** Responsible owner */
    owner: string
    /** Timeline for completion */
    timeline: string
    /** Expected impact */
    impact: string
}

/**
 * Next step structure.
 */
export interface NextStep {
    /** Step category */
    step: string
    /** Action to take */
    action: string
    /** Timeline for action */
    timeline: string
}

/**
 * Performance trends analysis result.
 */
export interface PerformanceTrends {
    /** Trend analysis results */
    trends: {
        /** Overall trend direction */
        direction: 'improving' | 'declining' | 'stable'
        /** Build time trend */
        buildTime: { current: number; trend: number }
        /** Bundle size trend */
        bundleSize: { current: number; trend: number }
        /** Memory usage trend */
        memoryUsage: { current: number; trend: number }
        /** Overall performance trend */
        overall: { current: number; trend: number }
    }
    /** Trend analysis summary */
    analysis: string
    /** Optimization recommendations */
    recommendations: Array<string>
}
