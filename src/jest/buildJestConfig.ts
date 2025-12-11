"use strict";

import type { JestOptions, JestConfig } from "./types/config";
import { basePreset } from "./presets/basePreset";
import { reactPreset } from "./presets/reactPreset";
import { typescriptPreset } from "./presets/typescriptPreset";

export function buildJestConfig(options: JestOptions): JestConfig {
  // Apply preset if specified
  let presetOptions: JestOptions = { ...options };

  if (options.preset) {
    switch (options.preset) {
      case "react":
        presetOptions = reactPreset(options);
        break;
      case "typescript":
        presetOptions = typescriptPreset(options);
        break;
      case "base":
      default:
        presetOptions = basePreset(options);
        break;
    }
  } else {
    // Default to base preset if no preset specified
    presetOptions = basePreset(options);
  }

  // Build the final Jest configuration
  const config: JestConfig = {
    ...presetOptions,
    jestOptions: presetOptions,
    preset: presetOptions.preset,
    setupFiles: presetOptions.setupFiles,
    testMatch: presetOptions.testMatch,
    moduleFileExtensions: presetOptions.moduleFileExtensions,
    transform: presetOptions.transform,
    globals: presetOptions.globals,
    setupFilesAfterEnv: presetOptions.setupFilesAfterEnv,
    testEnvironment: presetOptions.testEnvironment,
    
    // Additional Jest configuration options
    collectCoverage: options.collectCoverage || false,
    coverageDirectory: options.coverageDirectory || "coverage",
    coverageReporters: options.coverageReporters || ["json", "lcov", "text", "clover"] as any,
    coverageThreshold: options.coverageThreshold as any,
    testTimeout: options.testTimeout || 5000,
    verbose: options.verbose || false,
    bail: options.bail || false,
    notify: options.notify || false,
    notifyMode: options.notifyMode || "always",
    maxWorkers: options.maxWorkers || "50%",
    rootDir: options.rootDir || process.cwd(),
    testPathIgnorePatterns: options.testPathIgnorePatterns || ["/node_modules/", "/dist/", "/build/"]
  };

  return config;
}