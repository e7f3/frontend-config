"use strict";

import type { JestOptions } from "../types/config";

export function basePreset(options: JestOptions = {}): JestOptions {
  return {
    ...options,
    testMatch: options.testMatch || ["**/__tests__/**/*.+(js|jsx|ts|tsx)", "**/?(*.)+(spec|test).+(js|jsx|ts|tsx)"],
    moduleFileExtensions: options.moduleFileExtensions || ["js", "jsx", "ts", "tsx", "json", "node"],
    preset: options.preset || "ts-jest",
    globals: {
      ...options.globals,
      "ts-jest": {
        diagnostics: {
          ignorePatterns: ["/node_modules/"]
        }
      }
    }
  };
}