import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import promise from 'eslint-plugin-promise';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      promise,
      unicorn,
    },
    rules: {
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'promise/always-return': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
];
