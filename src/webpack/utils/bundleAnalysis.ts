import type { BundleAnalysis, ModuleAnalysis, ChunkAnalysis, AssetAnalysis, AssetOptimizationRecommendation } from '../types/performance'

/**
 * Provides comprehensive bundle analysis with optimization recommendations.
 */
export class BundleAnalyzer {
    private readonly bundleAnalysis: BundleAnalysis
    // private readonly _recommendations: Array<AssetOptimizationRecommendation> = []

    constructor(bundleAnalysis: BundleAnalysis) {
        this.bundleAnalysis = bundleAnalysis
    }

    /**
     * Generates comprehensive bundle analysis report.
     * @returns Detailed analysis including summary, composition, and recommendations
     */
    public generateDetailedAnalysis(): {
        summary: BundleSummary
        composition: CompositionAnalysis
        optimization: OptimizationAnalysis
        recommendations: Array<AssetOptimizationRecommendation>
        trends: BundleTrends
    } {
        return {
            summary: this.generateBundleSummary(),
            composition: this.analyzeComposition(),
            optimization: this.analyzeOptimization(),
            recommendations: this.generateOptimizationRecommendations(),
            trends: this.analyzeTrends(),
        }
    }

    /**
     * Analyzes bundle composition and structure.
     * @returns Analysis of vendor, app, chunks, and dependencies
     */
    public analyzeBundleComposition(): {
        vendorAnalysis: VendorAnalysis
        appAnalysis: AppAnalysis
        chunkAnalysis: ChunkBreakdown
        dependencyAnalysis: DependencyAnalysis
    } {
        return {
            vendorAnalysis: this.analyzeVendorBundle(),
            appAnalysis: this.analyzeAppBundle(),
            chunkAnalysis: this.analyzeChunks(),
            dependencyAnalysis: this.analyzeDependencies(),
        }
    }

    /**
     * Generates asset optimization recommendations.
     * @returns Array of optimization recommendations for large assets and duplicates
     */
    public generateAssetOptimizationRecommendations(): Array<AssetOptimizationRecommendation> {
        const recommendations: Array<AssetOptimizationRecommendation> = []

        // Analyze large assets
        const largeAssets = this.bundleAnalysis.assets.filter((asset) => asset.size > 100 * 1024)
        largeAssets.forEach((asset) => {
            recommendations.push({
                assetName: asset.name,
                currentSize: asset.size,
                optimizedSize: Math.floor(asset.size * 0.6), // 40% reduction target
                savings: asset.size - Math.floor(asset.size * 0.6),
                type: this.getOptimizationType(asset),
                priority: asset.size > 500 * 1024 ? 'high' : 'medium',
                description: `Large ${asset.type} asset detected. Implement ${this.getOptimizationType(asset)} optimization.`,
                difficulty: this.getOptimizationDifficulty(asset),
                implementationTime: this.getImplementationTime(asset),
            })
        })

        // Analyze duplicate chunks
        const duplicateAnalysis = this.findDuplicateChunks()
        duplicateAnalysis.forEach((duplicate) => {
            recommendations.push({
                assetName: duplicate.name,
                currentSize: duplicate.totalSize,
                optimizedSize: duplicate.uniqueSize,
                savings: duplicate.totalSize - duplicate.uniqueSize,
                type: 'split',
                priority: 'high',
                description: 'Duplicate chunk detected. Implement better code splitting strategy.',
                difficulty: 'medium',
                implementationTime: '2-4 hours',
            })
        })

        // Analyze vendor bundle size
        if (this.bundleAnalysis.vendorSize > this.bundleAnalysis.totalSize * 0.4) {
            recommendations.push({
                assetName: 'vendor-bundle',
                currentSize: this.bundleAnalysis.vendorSize,
                optimizedSize: Math.floor(this.bundleAnalysis.vendorSize * 0.7),
                savings: this.bundleAnalysis.vendorSize - Math.floor(this.bundleAnalysis.vendorSize * 0.7),
                type: 'vendor-split',
                priority: 'high',
                description: 'Vendor bundle is too large. Consider dynamic imports for vendor modules.',
                difficulty: 'medium',
                implementationTime: '1-2 hours',
            })
        }

        // Analyze unused dependencies
        const unusedAnalysis = this.findUnusedDependencies()
        unusedAnalysis.forEach((dep) => {
            recommendations.push({
                assetName: dep.name,
                currentSize: dep.size,
                optimizedSize: 0,
                savings: dep.size,
                type: 'tree-shake',
                priority: 'high',
                description: `Unused dependency detected: ${dep.name}. Remove from bundle.`,
                difficulty: 'easy',
                implementationTime: '30 minutes',
            })
        })

        return recommendations
    }

    /**
     * Analyzes bundle size trends and patterns.
     * @returns Bundle trends analysis with optimization potential
     */
    public analyzeBundleTrends(): BundleTrends {
        return {
            sizeDistribution: this.analyzeSizeDistribution(),
            growthPattern: this.analyzeGrowthPattern(),
            optimizationPotential: this.calculateOptimizationPotential(),
            comparisonBaseline: this.generateComparisonBaseline(),
        }
    }

    /**
     * Generates code splitting recommendations.
     * @returns Array of code splitting recommendations for large modules
     */
    public generateCodeSplittingRecommendations(): Array<CodeSplittingRecommendation> {
        const recommendations: Array<CodeSplittingRecommendation> = []

        // Analyze large modules for potential splitting
        const largeModules = this.bundleAnalysis.modules.filter((module) => module.size > 50 * 1024).sort((a, b) => b.size - a.size)

        largeModules.forEach((module) => {
            if (module.category === 'app') {
                recommendations.push({
                    moduleName: module.name,
                    currentSize: module.size,
                    suggestedChunkSize: Math.floor(module.size * 0.8),
                    type: 'route-based',
                    priority: module.size > 200 * 1024 ? 'high' : 'medium',
                    description: `Consider route-based code splitting for ${module.name}`,
                    implementationStrategy: 'Dynamic import with React.lazy or similar',
                    expectedSavings: Math.floor(module.size * 0.3),
                })
            }
        })

        // Analyze vendor modules for dynamic imports
        const vendorModules = this.bundleAnalysis.modules
            .filter((module) => module.isVendor && module.size > 30 * 1024)
            .sort((a, b) => b.size - a.size)
            .slice(0, 5) // Top 5 vendor modules

        vendorModules.forEach((module) => {
            recommendations.push({
                moduleName: module.name,
                currentSize: module.size,
                suggestedChunkSize: Math.floor(module.size * 0.7),
                type: 'vendor-dynamic',
                priority: module.size > 100 * 1024 ? 'high' : 'medium',
                description: `Consider dynamic import for ${module.name} to reduce initial bundle size`,
                implementationStrategy: 'Use dynamic imports for non-critical vendor modules',
                expectedSavings: Math.floor(module.size * 0.4),
            })
        })

        return recommendations
    }

    /**
     * Calculates bundle health score based on composition.
     * @returns Health score with individual component scores and grade
     */
    public calculateBundleHealthScore(): {
        overallScore: number
        scores: {
            sizeScore: number
            compositionScore: number
            optimizationScore: number
            maintainabilityScore: number
        }
        grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
        status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    } {
        // Calculate individual scores
        const sizeScore = this.calculateSizeScore()
        const compositionScore = this.calculateCompositionScore()
        const optimizationScore = this.calculateOptimizationScore()
        const maintainabilityScore = this.calculateMaintainabilityScore()

        // Calculate weighted overall score
        const overallScore = Math.round(sizeScore * 0.3 + compositionScore * 0.25 + optimizationScore * 0.25 + maintainabilityScore * 0.2)

        const { grade, status } = this.getGradeAndStatus(overallScore)

        return {
            overallScore,
            scores: {
                sizeScore,
                compositionScore,
                optimizationScore,
                maintainabilityScore,
            },
            grade,
            status,
        }
    }

    /**
     * Generates dependency analysis report.
     * @returns Detailed analysis of dependencies and optimization suggestions
     */
    private generateDependencyAnalysis(): DependencyAnalysis {
        const dependencies = this.bundleAnalysis.modules
            .filter((module) => module.isVendor)
            .reduce<Record<string, any>>((acc, module) => {
                const packageName = this.extractPackageName(module.path)
                if (!acc[packageName]) {
                    acc[packageName] = {
                        name: packageName,
                        size: 0,
                        modules: [],
                        category: this.categorizeDependency(packageName),
                    }
                }
                acc[packageName].size += module.size
                acc[packageName].modules.push(module.name)
                return acc
            }, {})

        // Calculate dependency metrics
        const totalVendorSize = Object.values(dependencies).reduce((sum: number, dep: any) => sum + dep.size, 0)
        const dependencyCount = Object.keys(dependencies).length

        return {
            totalDependencies: dependencyCount,
            totalSize: totalVendorSize,
            averageSize: dependencyCount > 0 ? totalVendorSize / dependencyCount : 0,
            largestDependencies: Object.values(dependencies)
                .sort((a: any, b: any) => b.size - a.size)
                .slice(0, 10),
            categories: this.categorizeDependencies(dependencies),
            unusedDependencies: this.findUnusedDependencies(),
            heavyDependencies: Object.values(dependencies)
                .filter((dep: any) => dep.size > 50 * 1024)
                .sort((a: any, b: any) => b.size - a.size),
            optimizationSuggestions: this.generateDependencyOptimizationSuggestions(dependencies),
        }
    }

    // Private helper methods

    private generateBundleSummary(): BundleSummary {
        const { totalSize } = this.bundleAnalysis
        const { gzippedSize } = this.bundleAnalysis
        const compressionRatio = totalSize > 0 ? (totalSize - gzippedSize) / totalSize : 0

        return {
            totalSize,
            gzippedSize,
            compressionRatio,
            totalAssets: this.bundleAnalysis.assets.length,
            totalModules: this.bundleAnalysis.modules.length,
            totalChunks: this.bundleAnalysis.chunks.length,
            vendorSize: this.bundleAnalysis.vendorSize,
            appSize: this.bundleAnalysis.appSize,
            commonSize: this.bundleAnalysis.commonSize,
            largestAsset: this.bundleAnalysis.assets[0] || null,
            largestModule: this.bundleAnalysis.modules[0] || null,
            largestChunk: this.bundleAnalysis.chunks[0] || null,
        }
    }

    private analyzeComposition(): CompositionAnalysis {
        const vendorPercentage = (this.bundleAnalysis.vendorSize / this.bundleAnalysis.totalSize) * 100
        const appPercentage = (this.bundleAnalysis.appSize / this.bundleAnalysis.totalSize) * 100
        const commonPercentage = (this.bundleAnalysis.commonSize / this.bundleAnalysis.totalSize) * 100

        const moduleDistribution = this.bundleAnalysis.modules.reduce<Record<string, number>>((acc, module) => {
            acc[module.category] = (acc[module.category] || 0) + module.size
            return acc
        }, {})

        const assetTypeDistribution = this.bundleAnalysis.assets.reduce<Record<string, number>>((acc, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + asset.size
            return acc
        }, {})

        return {
            vendorPercentage,
            appPercentage,
            commonPercentage,
            moduleDistribution,
            assetTypeDistribution,
            bundleBalance: this.calculateBundleBalance(),
            duplicationLevel: this.calculateDuplicationLevel(),
        }
    }

    private analyzeOptimization(): OptimizationAnalysis {
        // opportunities variable is intentionally unused but kept for API compatibility
        const potentialSavings = {
            compression: this.calculateCompressionOpportunities(),
            treeShaking: this.calculateTreeShakingOpportunities(),
            codeSplitting: this.calculateCodeSplittingOpportunities(),
            lazyLoading: this.calculateLazyLoadingOpportunities(),
        }

        let totalPotentialSavings = 0
        Object.values(potentialSavings).forEach((saving) => {
            totalPotentialSavings += saving
        })

        return {
            currentOptimizationLevel: this.calculateCurrentOptimizationLevel(),
            potentialSavings,
            totalPotentialSavings,
            optimizationOpportunities: [],
            priorityOptimizations: this.getPriorityOptimizations(),
        }
    }

    private generateOptimizationRecommendations(): Array<AssetOptimizationRecommendation> {
        return this.generateAssetOptimizationRecommendations()
    }

    private analyzeTrends(): BundleTrends {
        return this.analyzeBundleTrends()
    }

    private analyzeVendorBundle(): VendorAnalysis {
        const vendorModules = this.bundleAnalysis.modules.filter((module) => module.isVendor)
        const vendorAssets = this.bundleAnalysis.assets.filter(
            (asset) => asset.name.includes('vendor') || asset.name.includes('node_modules')
        )

        return {
            size: this.bundleAnalysis.vendorSize,
            moduleCount: vendorModules.length,
            assetCount: vendorAssets.length,
            largestModules: vendorModules.sort((a, b) => b.size - a.size).slice(0, 10),
            duplicateModules: this.findDuplicateModules(vendorModules),
            unusedModules: this.findUnusedModules(vendorModules),
            optimizationPotential: this.calculateVendorOptimizationPotential(),
        }
    }

    private analyzeAppBundle(): AppAnalysis {
        const appModules = this.bundleAnalysis.modules.filter((module) => !module.isVendor)
        const appAssets = this.bundleAnalysis.assets.filter(
            (asset) => !asset.name.includes('vendor') && !asset.name.includes('node_modules')
        )

        return {
            size: this.bundleAnalysis.appSize,
            moduleCount: appModules.length,
            assetCount: appAssets.length,
            largestModules: appModules.sort((a, b) => b.size - a.size).slice(0, 10),
            sharedModules: appModules.filter((module) => module.category === 'shared'),
            treeShakingPotential: this.calculateTreeShakingPotential(appModules),
            codeSplittingPotential: this.calculateCodeSplittingPotential(appModules),
        }
    }

    private analyzeChunks(): ChunkBreakdown {
        return {
            totalChunks: this.bundleAnalysis.chunks.length,
            chunkTypes: this.bundleAnalysis.chunks.reduce<Record<string, number>>((acc, chunk) => {
                acc[chunk.type] = (acc[chunk.type] || 0) + 1
                return acc
            }, {}),
            largestChunks: this.bundleAnalysis.chunks.sort((a, b) => b.size - a.size).slice(0, 10),
            duplicatedChunks: this.bundleAnalysis.chunks.filter((chunk) => chunk.isDuplicated),
            chunkEfficiency: this.calculateChunkEfficiency(),
        }
    }

    private analyzeDependencies(): DependencyAnalysis {
        return this.generateDependencyAnalysis()
    }

    private findDuplicateChunks(): Array<{ name: string; totalSize: number; uniqueSize: number }> {
        // Simplified duplicate detection
        const chunkNames = this.bundleAnalysis.chunks.map((chunk) => chunk.name)
        const duplicates = chunkNames.filter((name, index) => chunkNames.indexOf(name) !== index)

        return duplicates.map((name) => {
            const chunks = this.bundleAnalysis.chunks.filter((chunk) => chunk.name === name)
            const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
            return {
                name,
                totalSize,
                uniqueSize: chunks[0]?.size || 0,
            }
        })
    }

    private findUnusedDependencies(): Array<{ name: string; size: number; path: string }> {
        // Simplified unused dependency detection
        // In a real implementation, this would analyze import statements and usage
        return this.bundleAnalysis.modules
            .filter((module) => module.isVendor && module.size < 1000) // Small vendor modules
            .map((module) => ({
                name: this.extractPackageName(module.path),
                size: module.size,
                path: module.path,
            }))
    }

    private getOptimizationType(asset: AssetAnalysis): 'compress' | 'split' | 'lazy-load' | 'tree-shake' | 'vendor-split' {
        if (asset.type === 'image') return 'compress'
        if (asset.type === 'javascript' && asset.size > 200 * 1024) return 'split'
        if (asset.size > 100 * 1024) return 'lazy-load'
        return 'compress'
    }

    private getOptimizationDifficulty(asset: AssetAnalysis): 'easy' | 'medium' | 'hard' {
        if (asset.type === 'image') return 'easy'
        if (asset.size > 500 * 1024) return 'hard'
        return 'medium'
    }

    private getImplementationTime(asset: AssetAnalysis): string {
        const sizeMB = asset.size / (1024 * 1024)
        if (sizeMB > 1) return '2-4 hours'
        if (sizeMB > 0.5) return '1-2 hours'
        return '30 minutes'
    }

    private analyzeSizeDistribution(): SizeDistribution {
        const { assets } = this.bundleAnalysis
        const sizeRanges = {
            '0-10KB': assets.filter((a) => a.size < 10 * 1024).length,
            '10-50KB': assets.filter((a) => a.size >= 10 * 1024 && a.size < 50 * 1024).length,
            '50-100KB': assets.filter((a) => a.size >= 50 * 1024 && a.size < 100 * 1024).length,
            '100-500KB': assets.filter((a) => a.size >= 100 * 1024 && a.size < 500 * 1024).length,
            '500KB+': assets.filter((a) => a.size >= 500 * 1024).length,
        }

        return {
            sizeRanges,
            largestAssets: assets.slice(0, 10),
            smallestAssets: assets.slice(-10),
            sizeDistribution: this.calculateSizeDistribution(assets),
        }
    }

    private analyzeGrowthPattern(): GrowthPattern {
        // This would analyze historical data in a real implementation
        return {
            trend: 'stable',
            growthRate: 0,
            predictedSize: this.bundleAnalysis.totalSize,
            factors: [],
        }
    }

    private calculateOptimizationPotential(): OptimizationPotential {
        return {
            immediate: this.calculateImmediateOptimizationPotential(),
            medium: this.calculateMediumOptimizationPotential(),
            longTerm: this.calculateLongTermOptimizationPotential(),
        }
    }

    private generateComparisonBaseline(): ComparisonBaseline {
        return {
            industryBenchmarks: this.getIndustryBenchmarks(),
            bestPractices: this.getBestPractices(),
            recommendations: [],
        }
    }

    private calculateSizeScore(): number {
        const { totalSize } = this.bundleAnalysis
        const maxRecommendedSize = 1024 * 1024 // 1MB

        if (totalSize <= maxRecommendedSize * 0.5) return 100
        if (totalSize <= maxRecommendedSize * 0.75) return 85
        if (totalSize <= maxRecommendedSize) return 70
        if (totalSize <= maxRecommendedSize * 1.5) return 50
        return 30
    }

    private calculateCompositionScore(): number {
        const vendorPercentage = (this.bundleAnalysis.vendorSize / this.bundleAnalysis.totalSize) * 100

        if (vendorPercentage <= 30) return 100
        if (vendorPercentage <= 40) return 85
        if (vendorPercentage <= 50) return 70
        if (vendorPercentage <= 60) return 50
        return 30
    }

    private calculateOptimizationScore(): number {
        // Based on compression ratio and other factors
        const compressionRatio = this.bundleAnalysis.gzippedSize / this.bundleAnalysis.totalSize

        if (compressionRatio <= 0.3) return 100
        if (compressionRatio <= 0.4) return 85
        if (compressionRatio <= 0.5) return 70
        return 50
    }

    private calculateMaintainabilityScore(): number {
        const chunkCount = this.bundleAnalysis.chunks.length
        const moduleCount = this.bundleAnalysis.modules.length

        // Fewer, well-organized chunks = higher maintainability
        if (chunkCount <= 5 && moduleCount <= 500) return 100
        if (chunkCount <= 10 && moduleCount <= 1000) return 85
        if (chunkCount <= 20 && moduleCount <= 1500) return 70
        return 50
    }

    private getGradeAndStatus(score: number): {
        grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
        status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    } {
        if (score >= 90) return { grade: 'A', status: 'excellent' }
        if (score >= 80) return { grade: 'B', status: 'good' }
        if (score >= 70) return { grade: 'C', status: 'fair' }
        if (score >= 60) return { grade: 'D', status: 'poor' }
        if (score >= 50) return { grade: 'E', status: 'poor' }
        return { grade: 'F', status: 'critical' }
    }

    private extractPackageName(modulePath: string): string {
        // Extract package name from module path
        const parts = modulePath.split('/')
        if (modulePath.includes('node_modules')) {
            const index = parts.indexOf('node_modules')
            return index !== -1 && parts[index + 1] ? parts[index + 1]! : 'unknown'
        }
        const lastPart = parts[parts.length - 1]
        return lastPart ?? 'unknown'
    }

    private categorizeDependency(packageName: string): 'framework' | 'utility' | 'ui' | 'other' {
        const frameworkPackages = ['react', 'vue', 'angular', 'svelte']
        const uiPackages = ['@mui/material', 'antd', 'chakra-ui', 'bootstrap']
        const utilityPackages = ['lodash', 'ramda', 'date-fns', 'axios']

        if (frameworkPackages.some((fw) => packageName.includes(fw))) return 'framework'
        if (uiPackages.some((ui) => packageName.includes(ui))) return 'ui'
        if (utilityPackages.some((util) => packageName.includes(util))) return 'utility'
        return 'other'
    }

    private calculateBundleBalance(): number {
        const vendorRatio = this.bundleAnalysis.vendorSize / this.bundleAnalysis.totalSize
        const appRatio = this.bundleAnalysis.appSize / this.bundleAnalysis.totalSize
        const commonRatio = this.bundleAnalysis.commonSize / this.bundleAnalysis.totalSize

        // Ideal balance: vendor <= 40%, app >= 50%, common <= 10%
        const vendorScore = vendorRatio <= 0.4 ? 1 : Math.max(0, 1 - (vendorRatio - 0.4) * 2)
        const appScore = appRatio >= 0.5 ? 1 : Math.max(0, appRatio / 0.5)
        const commonScore = commonRatio <= 0.1 ? 1 : Math.max(0, 1 - (commonRatio - 0.1) * 5)

        return ((vendorScore + appScore + commonScore) / 3) * 100
    }

    private calculateDuplicationLevel(): number {
        const moduleSizes = this.bundleAnalysis.modules.map((m) => m.size)
        const avgSize = moduleSizes.reduce((sum, size) => sum + size, 0) / moduleSizes.length
        const variance = moduleSizes.reduce((sum, size) => sum + Math.pow(size - avgSize, 2), 0) / moduleSizes.length

        // Lower variance = less duplication
        return Math.max(0, 100 - (Math.sqrt(variance) / avgSize) * 100)
    }

    private findDuplicateModules(modules: Array<ModuleAnalysis>): Array<ModuleAnalysis> {
        // Simplified duplicate detection
        const sizeMap = new Map<number, Array<ModuleAnalysis>>()
        modules.forEach((module) => {
            const size = Math.floor(module.size / 1000) * 1000 // Group by 1KB ranges
            if (!sizeMap.has(size)) sizeMap.set(size, [])
            sizeMap.get(size)!.push(module)
        })

        return Array.from(sizeMap.values())
            .filter((group) => group.length > 1)
            .flat()
            .slice(0, 10)
    }

    private findUnusedModules(modules: Array<ModuleAnalysis>): Array<ModuleAnalysis> {
        return modules.filter((module) => module.size < 500) // Simplified criteria
    }

    private calculateVendorOptimizationPotential(): number {
        const vendorModules = this.bundleAnalysis.modules.filter((m) => m.isVendor)
        const largeVendorModules = vendorModules.filter((m) => m.size > 50 * 1024)

        return (largeVendorModules.length / vendorModules.length) * 100
    }

    private calculateTreeShakingPotential(modules: Array<ModuleAnalysis>): number {
        const largeModules = modules.filter((m) => m.size > 10 * 1024)
        return (largeModules.length / modules.length) * 100
    }

    private calculateCodeSplittingPotential(modules: Array<ModuleAnalysis>): number {
        const routeModules = modules.filter((m) => m.name.includes('page') || m.name.includes('route') || m.name.includes('view'))
        return (routeModules.length / modules.length) * 100
    }

    private calculateChunkEfficiency(): number {
        const avgChunkSize = this.bundleAnalysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0) / this.bundleAnalysis.chunks.length
        const optimalChunkSize = 250 * 1024 // 250KB

        return Math.max(0, 100 - (Math.abs(avgChunkSize - optimalChunkSize) / optimalChunkSize) * 100)
    }

    private generateDependencyOptimizationSuggestions(dependencies: Record<string, any>): Array<string> {
        const suggestions = []
        const heavyDeps = Object.values(dependencies).filter((dep: any) => dep.size > 100 * 1024)

        if (heavyDeps.length > 3) {
            suggestions.push('Consider replacing heavy dependencies with lighter alternatives')
        }

        const frameworkDeps = Object.values(dependencies).filter((dep: any) => dep.category === 'framework')
        if (frameworkDeps.length > 1) {
            suggestions.push('Multiple framework dependencies detected - consider standardizing')
        }

        return suggestions
    }

    private calculateSizeDistribution(assets: Array<AssetAnalysis>): Record<string, number> {
        const distribution: Record<string, number> = {}
        assets.forEach((asset) => {
            const sizeKB = Math.floor(asset.size / 1024)
            const range = `${sizeKB}-${sizeKB + 9}KB`
            distribution[range] = (distribution[range] || 0) + 1
        })
        return distribution
    }

    private calculateImmediateOptimizationPotential(): number {
        // Assets that can be optimized immediately
        const compressibleAssets = this.bundleAnalysis.assets.filter((a) => a.type === 'image' || a.type === 'css')
        return (compressibleAssets.length / this.bundleAnalysis.assets.length) * 100
    }

    private calculateMediumOptimizationPotential(): number {
        // Code splitting opportunities
        const splittableModules = this.bundleAnalysis.modules.filter((m) => m.size > 50 * 1024 && !m.isVendor)
        return (splittableModules.length / this.bundleAnalysis.modules.length) * 100
    }

    private calculateLongTermOptimizationPotential(): number {
        // Architectural improvements
        return 30 // Placeholder
    }

    private getIndustryBenchmarks(): any {
        return {
            bundleSize: { good: '< 500KB', acceptable: '< 1MB', poor: '> 1MB' },
            vendorRatio: { good: '< 30%', acceptable: '< 40%', poor: '> 50%' },
            chunks: { good: '< 10', acceptable: '< 20', poor: '> 30' },
        }
    }

    private getBestPractices(): Array<string> {
        return [
            'Implement code splitting for routes',
            'Use dynamic imports for vendor modules',
            'Optimize images and static assets',
            'Remove unused dependencies',
            'Implement tree shaking',
            'Use compression for text assets',
        ]
    }

    private getPriorityOptimizations(): Array<string> {
        return this.generateAssetOptimizationRecommendations()
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return priorityOrder[b.priority] - priorityOrder[a.priority]
            })
            .slice(0, 5)
            .map((rec) => rec.description)
    }

    private calculateCompressionOpportunities(): number {
        // Calculate potential savings from better compression
        return this.bundleAnalysis.totalSize * 0.1 // 10% potential savings
    }

    private calculateTreeShakingOpportunities(): number {
        const unusedModules = this.findUnusedDependencies()
        return unusedModules.reduce((sum, dep) => sum + dep.size, 0)
    }

    private calculateCodeSplittingOpportunities(): number {
        const largeModules = this.bundleAnalysis.modules.filter((m) => m.size > 50 * 1024)
        return largeModules.reduce((sum, module) => sum + module.size * 0.3, 0) // 30% savings potential
    }

    private calculateLazyLoadingOpportunities(): number {
        const lazyLoadableAssets = this.bundleAnalysis.assets.filter((a) => a.size > 100 * 1024)
        return lazyLoadableAssets.reduce((sum, asset) => sum + asset.size * 0.5, 0) // 50% savings potential
    }

    private calculateCurrentOptimizationLevel(): number {
        const compressionRatio = this.bundleAnalysis.gzippedSize / this.bundleAnalysis.totalSize
        return (1 - compressionRatio) * 100
    }

    private categorizeDependencies(dependencies: Record<string, any>): Record<string, any> {
        const categorized = {
            framework: {},
            utility: {},
            ui: {},
            other: {},
        }

        Object.entries(dependencies).forEach(([name, dep]: [string, any]) => {
            if (dep.category && typeof dep.category === 'string') {
                const category = dep.category as keyof typeof categorized
                if (categorized[category]) {
                    const categoryObj = categorized[category] as Record<string, any>
                    categoryObj[name] = dep
                }
            }
        })

        return categorized
    }
}

// Type definitions for the analysis results
interface BundleSummary {
    totalSize: number
    gzippedSize: number
    compressionRatio: number
    totalAssets: number
    totalModules: number
    totalChunks: number
    vendorSize: number
    appSize: number
    commonSize: number
    largestAsset: AssetAnalysis | null
    largestModule: ModuleAnalysis | null
    largestChunk: ChunkAnalysis | null
}

interface CompositionAnalysis {
    vendorPercentage: number
    appPercentage: number
    commonPercentage: number
    moduleDistribution: Record<string, number>
    assetTypeDistribution: Record<string, number>
    bundleBalance: number
    duplicationLevel: number
}

interface OptimizationAnalysis {
    currentOptimizationLevel: number
    potentialSavings: {
        compression: number
        treeShaking: number
        codeSplitting: number
        lazyLoading: number
    }
    totalPotentialSavings: number
    optimizationOpportunities: Array<string>
    priorityOptimizations: Array<string>
}

interface BundleTrends {
    sizeDistribution: SizeDistribution
    growthPattern: GrowthPattern
    optimizationPotential: OptimizationPotential
    comparisonBaseline: ComparisonBaseline
}

interface SizeDistribution {
    sizeRanges: Record<string, number>
    largestAssets: Array<AssetAnalysis>
    smallestAssets: Array<AssetAnalysis>
    sizeDistribution: Record<string, number>
}

interface GrowthPattern {
    trend: 'improving' | 'declining' | 'stable'
    growthRate: number
    predictedSize: number
    factors: Array<string>
}

interface OptimizationPotential {
    immediate: number
    medium: number
    longTerm: number
}

interface ComparisonBaseline {
    industryBenchmarks: any
    bestPractices: Array<string>
    recommendations: Array<string>
}

interface VendorAnalysis {
    size: number
    moduleCount: number
    assetCount: number
    largestModules: Array<ModuleAnalysis>
    duplicateModules: Array<ModuleAnalysis>
    unusedModules: Array<ModuleAnalysis>
    optimizationPotential: number
}

interface AppAnalysis {
    size: number
    moduleCount: number
    assetCount: number
    largestModules: Array<ModuleAnalysis>
    sharedModules: Array<ModuleAnalysis>
    treeShakingPotential: number
    codeSplittingPotential: number
}

interface ChunkBreakdown {
    totalChunks: number
    chunkTypes: Record<string, number>
    largestChunks: Array<ChunkAnalysis>
    duplicatedChunks: Array<ChunkAnalysis>
    chunkEfficiency: number
}

interface DependencyAnalysis {
    totalDependencies: number
    totalSize: number
    averageSize: number
    largestDependencies: Array<any>
    categories: Record<string, any>
    unusedDependencies: Array<any>
    heavyDependencies: Array<any>
    optimizationSuggestions: Array<string>
}

interface CodeSplittingRecommendation {
    moduleName: string
    currentSize: number
    suggestedChunkSize: number
    type: 'route-based' | 'vendor-dynamic' | 'feature-based'
    priority: 'high' | 'medium' | 'low'
    description: string
    implementationStrategy: string
    expectedSavings: number
}
