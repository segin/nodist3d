import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPromise from "eslint-plugin-promise";
import pluginUnicorn from "eslint-plugin-unicorn";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: {
      promise: pluginPromise,
      unicorn: pluginUnicorn,
    },
    rules: {
      "eqeqeq": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "promise/always-return": "error",
    }
  },
  {
    files: ["tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  pluginJs.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  eslintConfigPrettier,
];
