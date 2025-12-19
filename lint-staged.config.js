module.exports = {
    // Source TypeScript and JavaScript files
    'src/**/*.{ts,tsx}': ['eslint --fix', 'node scripts/typecheck.js', 'prettier --write'],

    'src/**/*.{js,jsx}': ['eslint --fix', 'prettier --write'],

    // Root level config files
    '*.{ts,tsx}': ['eslint --fix', 'node scripts/typecheck.js', 'prettier --write'],

    '*.{js,jsx}': ['eslint --fix', 'prettier --write'],

    // Scripts directory - only run eslint and prettier, skip TypeScript checking
    'scripts/**/*.{js,jsx}': ['eslint --fix', 'prettier --write'],

    // CSS, SCSS, and Stylus files
    '**/*.{css,scss,styl}': ['stylelint --fix', 'prettier --write'],

    // JSON files
    '**/*.json': ['prettier --write'],

    // Markdown files
    '**/*.md': ['prettier --write'],

    // YAML files
    '**/*.{yml,yaml}': ['prettier --write'],

    // Test files - run tests for changed test files
    '**/*.{test,spec}.{ts,tsx,js,jsx}': ['vitest run'],

    // Package.json files
    '**/package.json': ['prettier --write'],
}
