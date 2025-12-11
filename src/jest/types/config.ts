"use strict";

import type { Config } from "jest";

export interface JestOptions {
  /**
   * Common configuration options for Jest
   * Extendable by presets
   */
  preset?: string;
  setupFiles?: string[];
  testMatch?: string[];
  moduleFileExtensions?: string[];
  transform?: Record<string, string>;
  globals?: Record<string, unknown>;
  setupFilesAfterEnv?: string[];
  testEnvironment?: string;
  
  // Additional Jest configuration options
  collectCoverage?: boolean;
  coverageDirectory?: string;
  coverageReporters?: string[] | Config["coverageReporters"];
  coverageThreshold?: Record<string, number> | Config["coverageThreshold"];
  testTimeout?: number;
  verbose?: boolean;
  bail?: boolean;
  notify?: boolean;
  notifyMode?: string;
  maxWorkers?: string | number;
  rootDir?: string;
  testPathIgnorePatterns?: string[];
  
  // React-specific options
  moduleNameMapper?: Record<string, string>;
}

export interface JestConfig extends Config {
  /**
   * Project-specific Jest configuration
   * Built from JestOptions
   */
  jestOptions: JestOptions;
}