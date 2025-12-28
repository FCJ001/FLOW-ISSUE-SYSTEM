import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
    // ======================
    // 1. 忽略文件
    // ======================
    {
        ignores: [
            '**/dist/**',
            '**/build/**',
            '**/node_modules/**',
            '**/*.d.ts',
        ],
    },

    // ======================
    // 2. JS / TS 基础规则
    // ======================
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // ======================
    // 3. 通用（前后端都会用）
    // ======================
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            // import 顺序
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                },
            ],
        },
    },

    // ======================
    // 4. 前端（React / Browser）
    // ======================
    {
        files: ['apps/{host,web}/**/*.{ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-explicit-any': 'off'
        },
    },

    // ======================
    // 5. 后端（Node / Server）
    // ======================
    {
        files: ['apps/server/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // 后端允许 any（DTO / Filter 很常见）
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // ======================
    // 6. UI / Shared 包（偏库）
    // ======================
    {
        files: ['packages/**/*.{ts,tsx}'],
        rules: {
            // 库里允许 any（对外 API）
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // ======================
    // 7. Prettier 接管格式（必须放最后）
    // ======================
    prettier,
]