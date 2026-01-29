import globals from 'globals';
import js from '@eslint/js';
import promise from 'eslint-plugin-promise';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        THREE: 'readonly',
        JSZip: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
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
  js.configs.recommended,
  promise.configs['flat/recommended'],
  unicorn.configs['flat/recommended'],
  prettier,
  {
    rules: {
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'promise/always-return': 'error',

      'no-unused-vars': 'warn',
      'no-case-declarations': 'off',

      // Disable noisy unicorn rules
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/catch-error-name': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-dom-node-append': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/consistent-existence-index-check': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-class-fields': 'off',
      'unicorn/prefer-dom-node-remove': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/no-useless-promise-resolve-reject': 'off',
      'unicorn/no-immediate-mutation': 'off',
      'unicorn/prefer-optional-catch-binding': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-query-selector': 'off',
    },
  },
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        Quaternion: 'readonly',
        Mesh: 'readonly',
        BufferGeometry: 'readonly',
        MeshBasicMaterial: 'readonly',
        ObjectManager: 'readonly',
      },
    },
    rules: {
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off',
      'no-unused-vars': 'off',
      'unicorn/prefer-module': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', 'reference/'],
  },
];
