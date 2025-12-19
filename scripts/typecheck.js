#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

try {
    // Run TypeScript compiler without file paths to use the project configuration
    execSync('tsc --noEmit --project tsconfig.lint.json', { stdio: 'inherit' })
    process.exit(0)
} catch (error) {
    process.exit(1)
}
