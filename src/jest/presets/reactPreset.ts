"use strict";

import type { JestOptions } from "../types/config";
import { basePreset } from "./basePreset";

export function reactPreset(options: JestOptions = {}): JestOptions {
  return {
    ...basePreset(options),
    preset: options.preset || "react-testing-library",
    setupFilesAfterEnv: [
      ...(options.setupFilesAfterEnv || []),
      "<rootDir>/src/setupTests.ts"
    ],
    testEnvironment: "jsdom",
    // React-specific configuration
    moduleNameMapper: {
      "\\.\\.(css|less|scss|sass|styl)$": "identity-obj-proxy",
      ...options.moduleNameMapper
    },
    transform: {
      "\\.\\.(js|jsx|ts|tsx)$": "babel-jest",
      ...options.transform
    }
  };
}