import js from "@eslint/js";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";
import promise from "eslint-plugin-promise";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    unicorn.configs["flat/recommended"],
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
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
            "promise/always-return": "error"
        }
    },
    eslintConfigPrettier
];
