import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['Tasker/', 'node_modules/', 'coverage/', 'dist/', 'temp-*'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'no-undef': 'off', // TypeScript handles this
            ...tsPlugin.configs.recommended.rules,
            ...tsPlugin.configs.stylistic.rules,
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
        },
    },
];
