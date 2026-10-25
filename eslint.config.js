import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/eslint.config.js",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  // Service Worker
  {
    files: ["apps/web-app/public/sw.js"],

    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // project: [
        //   "./tsconfig.json",
        //   "./packages/features/chat-widget/tsconfig.eslint.json",
        // ],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "@next/next": next,
    },

    rules: {
      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-redundant-type-constituents": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "react-hooks/rules-of-hooks": "error",
    },
  },
];
