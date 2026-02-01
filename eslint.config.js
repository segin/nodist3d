import globals from 'globals';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginImport from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        THREE: 'readonly',
        JSZip: 'readonly',
      },
    },
    plugins: {
      promise: pluginPromise,
      unicorn: pluginUnicorn,
      import: pluginImport,
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'promise/always-return': 'error',
    },
  },
  {
    files: ['tests/**/*', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['src/frontend/worker.js'],
    languageOptions: {
      globals: {
        ...globals.worker,
      },
    },
  },
  eslintConfigPrettier,
];
