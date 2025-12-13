import { buildEslintConfig } from './src/eslint'

export default buildEslintConfig({
    ignorePatterns: ['eslint.config.ts', 'stylelint.config.ts', 'vitest.config.ts', '*.config.js', '*.config.ts', 'scripts/**/*'],
    tsconfigPath: './tsconfig.json',
})
