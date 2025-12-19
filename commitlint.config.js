module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Subject should be in present tense
        'subject-case': [
            2,
            'always',
            {
                case: 'lower-case',
            },
        ],
        // Subject should not end with a period
        'subject-full-stop': [2, 'never', '.'],
        // Subject should be between 10 and 100 characters
        'subject-min-length': [2, 'always', 10],
        'subject-max-length': [2, 'always', 100],
        // Body should not exceed 100 characters per line
        'body-max-line-length': [2, 'always', 100],
    },
}
