// @ts-check
import tseslint from "typescript-eslint";
import pluginAstro from "eslint-plugin-astro";
import { qwikEslint9Plugin } from "eslint-plugin-qwik";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import baseConfig from "../../eslint.config.mjs";

export default tseslint.config(
    baseConfig,

    pluginAstro.configs["flat/recommended"],
    pluginAstro.configs["flat/jsx-a11y-strict"],

    // * Astro overrides
    {
        files: ["**/*.astro"],
        rules: {
            "astro/no-unused-css-selector": "off",
            "astro/no-set-html-directive": "error",
            "astro/no-set-text-directive": "error",
        },
        languageOptions: {
            parserOptions: {
                project: true,
                projectService: false,
                extraFileExtensions: [".astro"],
            },
        },
    },

    // * Qwik overrides
    {
        files: ["**/*.ts", "**/*.tsx"],
        extends: [...qwikEslint9Plugin.configs.recommended, ...qwikEslint9Plugin.configs.strict],
        rules: {},
    },

    pluginPrettierRecommended,
);
