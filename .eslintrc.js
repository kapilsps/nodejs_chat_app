module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: ['eslint:recommended'],
    rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'arrow-parens': ['error', 'as-needed'],
        'object-curly-newline': ['off'],
        'max-len': ['error', { code: 120, tabWidth: 2, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true }],
        'no-console': 'off',
        'operator-linebreak': 'off',
        'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
        'consistent-return': 'warn',
        'no-tabs': 2,
        'import/extensions': ['error', 'ignorePackages', { js: 'always', mjs: 'always' }],
        camelcase: 'warn',
        'no-nested-ternary': 0,
    },
};
