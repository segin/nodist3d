import js from "@eslint/js";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";
import promise from "eslint-plugin-promise";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    unicorn.configs["flat/recommended"],
    {
        files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                ...globals.jest,
                THREE: "readonly",
                JSZip: "readonly"
            },
            ecmaVersion: 2022,
            sourceType: "module"
        },
        plugins: {
            promise
        },
        rules: {
            "eqeqeq": "error",
            "no-var": "error",
            "prefer-const": "error",
            "no-console": "warn",
            "promise/always-return": "error",
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
        }
    },
    eslintConfigPrettier
];
