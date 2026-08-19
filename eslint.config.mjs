import eslint from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noInlineStyles from 'eslint-plugin-no-inline-styles';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const compatibleImportPlugin = fixupPluginRules(importPlugin);
const compatibleJsxA11yPlugin = fixupPluginRules(jsxA11y);
const compatibleReactPlugin = fixupPluginRules(react);

const config = [
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    ignores: [
      '.next/**',
      'node_modules/**',
      'next.config.js',
      'migrations/**',
      'scripts/**',
      'tests/**',
    ],
  },
  eslint.configs.recommended,
  nextPlugin.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.amd,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: compatibleImportPlugin,
      'jsx-a11y': compatibleJsxA11yPlugin,
      react: compatibleReactPlugin,
      'simple-import-sort': simpleImportSort,
      'no-inline-styles': noInlineStyles,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      '@next/next/no-img-element': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/no-useless-default-assignment': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'show'],
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'no-inline-styles/no-inline-styles': 'warn',
      'react/button-has-type': 'warn',
      'react/display-name': 'error',
      'react/function-component-definition': 'warn',
      'react/hook-use-state': 'warn',
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-invalid-html-attribute': 'warn',
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function' },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace)$/]",
          message: 'Unexpected property on console object was called',
        },
      ],
    },
  },
  eslintConfigPrettier,
];

export default config;
