import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist", "build", "coverage"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      jsdoc,
    },
    rules: {
      // React/JSX
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": ["warn", { varsIgnorePattern: "React", args: "none", ignoreRestSiblings: true }],
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",

      // Imports
      "import/extensions": "off",
      "import/no-unresolved": "warn",
      "no-duplicate-imports": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // React Hooks
      "react-hooks/rules-of-hooks": "error", // critical!
      "react-hooks/exhaustive-deps": "warn",

      // Code safety
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // Readability
      "react/jsx-max-props-per-line": ["warn", { maximum: 1, when: "multiline" }],
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": ["warn", { ignoreCase: true }],
      "prefer-arrow-callback": "warn",
      "arrow-body-style": ["warn", "as-needed"],

      // Maintainability
      "import/no-default-export": "off",
      "no-magic-numbers": ["warn", { ignore: [0, 1, -1] }],
      "complexity": ["warn", 10],

      // Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",

      // JSDoc
      "jsdoc/require-jsdoc": [
        "warn",
        {
          contexts: [
            "FunctionDeclaration",
            "FunctionExpression",
            "ArrowFunctionExpression",
            "ClassDeclaration",
            "MethodDefinition",
          ],
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "warn",
      "jsdoc/require-returns": "warn",
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx"] },
      },
      jsdoc: {
        mode: "typescript", // use TS-style annotations for better tooling, even in JS
      },
    },
  },
];
