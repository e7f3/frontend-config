import { basePreset } from './presets/basePreset'
import { reactPreset } from './presets/reactPreset'
import { typescriptPreset } from './presets/typescriptPreset'
import type { JestConfig, JestOptions } from './types/config'

/**
 * Jest configuration builder with intelligent preset system.
 */

/**
 * Builds Jest configuration with intelligent preset support.
 * @param options - Configuration options including preset selection
 * @returns Complete Jest configuration object
 */
export function buildJestConfig(options: JestOptions = {}): JestConfig {
  // Step 1: Get preset configuration
  let presetConfig: Partial<JestConfig> = {}

  switch (options.preset) {
    case 'react':
      presetConfig = reactPreset()
      break
    case 'typescript':
      presetConfig = typescriptPreset()
      break
    case 'base':
    default:
      presetConfig = basePreset()
      break
  }

  // Step 2: Build final config with proper precedence:
  // User options > Preset defaults > Global defaults
  const config: JestConfig = {
    // Start with preset config
    ...presetConfig,

    // Override with all user-provided options
    ...options,

    // Special handling for arrays - merge instead of replace
    testPathIgnorePatterns: options.testPathIgnorePatterns ??
      presetConfig.testPathIgnorePatterns ?? ['/node_modules/', '/dist/', '/build/'],

    coverageReporters: options.coverageReporters ?? presetConfig.coverageReporters ?? ['json', 'lcov', 'text', 'clover'],

    // Set global defaults only if not in preset or user options
    rootDir: options.rootDir ?? presetConfig.rootDir ?? process.cwd(),
    collectCoverage: options.collectCoverage ?? presetConfig.collectCoverage ?? false,
    coverageDirectory: options.coverageDirectory ?? presetConfig.coverageDirectory ?? 'coverage',
    testTimeout: options.testTimeout ?? presetConfig.testTimeout ?? 3000,
    verbose: options.verbose ?? presetConfig.verbose ?? false,
    bail: options.bail ?? presetConfig.bail ?? false,
    notify: options.notify ?? presetConfig.notify ?? false,
    notifyMode: options.notifyMode ?? presetConfig.notifyMode ?? 'always',
    maxWorkers: options.maxWorkers ?? presetConfig.maxWorkers ?? '50%',

    // Coverage threshold - user option takes full precedence
    coverageThreshold: options.coverageThreshold ?? presetConfig.coverageThreshold,
  }

  // Remove the 'preset' key from final config (it's not a valid Jest option)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { preset, ...finalConfig } = config

  return finalConfig as JestConfig
}
