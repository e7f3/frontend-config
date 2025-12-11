"use strict";

import type { JestOptions } from "../types/config";
import { basePreset } from "./basePreset";

export function typescriptPreset(options: JestOptions = {}): JestOptions {
  return {
    ...basePreset(options),
    preset: options.preset || "ts-jest",
    globals: {
      ...options.globals,
      "ts-jest": {
        diagnostics: {
          ignorePatterns: ["/node_modules/"]
        },
        tsconfig: "tsconfig.json"
      }
    },
    // TypeScript-specific configuration
    moduleFileExtensions: [
      ...(options.moduleFileExtensions || []),
      "ts",
      "tsx"
    ],
    transform: {
      "\\.\\.(ts|tsx)$": "ts-jest",
      ...options.transform
    },
    testMatch: [
      ...(options.testMatch || []),
      "**/__tests__/**/*.+(ts|tsx)",
      "**/?(*.)+(spec|test).+(ts|tsx)"
    ]
  };
}