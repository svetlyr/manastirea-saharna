// @ts-check
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist", "**/node_modules", "**/.astro", "**/.github", "**/.git", "**/.changeset", "**/*.mjs"],
    },

    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,

    {
        files: ["**/*.ts", "**/*.tsx", "**/*.astro"],
        rules: {
            "no-unused-vars": "off",
            "no-duplicate-imports": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
            "@typescript-eslint/restrict-template-expressions": ["warn", { allowNumber: true }],
            "@typescript-eslint/no-confusing-void-expression": ["warn", { ignoreArrowShorthand: true }],

            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "error",
        },
        languageOptions: {
            parserOptions: {
                project: false,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: { ...globals.browser, ...globals.node, ...globals.es2026 },
        },
    },

    {
        files: ["**/*.d.ts"],
        rules: {
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
        },
    },
);
