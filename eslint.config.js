import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPromise from "eslint-plugin-promise";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginImport from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "docs/**", "eslint.config.js"],
  },
  // Base JS recommendations
  pluginJs.configs.recommended,
  // Promise plugin
  pluginPromise.configs["flat/recommended"],
  // Unicorn plugin
  pluginUnicorn.configs["flat/recommended"],
  // Custom configuration
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Requested specific rules
      "eqeqeq": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "promise/always-return": "error",

      // Import plugin rules (manual setup since no flat config)
      ...pluginImport.configs.recommended.rules,

      // Unicorn overrides to be less annoying in legacy code
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-module": "off", // We are moving to modules but might have legacy
    },
    settings: {
        // Basic node resolver for import plugin
        "import/resolver": {
            node: {
                extensions: [".js", ".mjs", ".cjs"]
            }
        }
    }
  },
  // Prettier config must be last to override other formatting rules
  eslintConfigPrettier,
];
