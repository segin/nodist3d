import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginImport from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  pluginUnicorn.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'promise/always-return': 'error',

      // Optional: Relax some unicorn rules that might be too strict for an existing codebase
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off', // null is common in Three.js and DOM
      'unicorn/prefer-module': 'off', // We are transitioning, don't break legacy scripts yet
    },
  },
  {
    files: ['**/*.test.js', '**/tests/**/*.js', '**/__mocks__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  prettier,
];
