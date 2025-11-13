import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        ignores: ["dist/**", "node_modules/**"],
    },

    // 🌐 Base JS + Node setup
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,

            // Import order and hygiene
            "import/order": [
                "warn",
                {
                    groups: [
                        ["builtin", "external"],
                        ["internal"],
                        ["parent", "sibling", "index"],
                    ],
                    "newlines-between": "always",
                },
            ],
            "import/no-unresolved": "off", // handled by TS
        },
    },

    // 🟦 TypeScript + Plugins setup
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tseslint.parser, // ✅ Tell ESLint to use the TS parser
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: process.cwd(),
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin, // ✅ Register the plugin properly
            import: importPlugin,
            jsdoc,
        },
        rules: {
            // ✅ TypeScript-specific rules
            "no-unused-vars": "off", // disable base
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-var-requires": "off",
            "no-console": "off",

            // 🧩 Import rules
            "import/order": [
                "warn",
                {
                    groups: [
                        ["builtin", "external"],
                        ["internal"],
                        ["parent", "sibling", "index"],
                    ],
                    "newlines-between": "always",
                },
            ],

            // 📚 JSDoc rules
            "jsdoc/check-alignment": "warn",
            "jsdoc/check-indentation": "warn",
            "jsdoc/check-param-names": "error",
            "jsdoc/check-tag-names": "error",
            "jsdoc/check-types": "error",
            "jsdoc/require-jsdoc": [
                "warn",
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false,
                    },
                },
            ],
            "jsdoc/require-param": "warn",
            "jsdoc/require-returns": "warn",
        },
    },

    // 🧹 Prettier disables formatting conflicts
    prettier,
];
