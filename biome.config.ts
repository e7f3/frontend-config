'use strict'

import { buildBiomeConfig } from './src/biome'

export default buildBiomeConfig({
    ignorePatterns: ['biome.config.ts', 'eslint.config.ts', 'stylelint.config.ts', 'vitest.config.ts', '*.config.js', '*.config.ts'],
})