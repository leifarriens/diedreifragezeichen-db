// @ts-check

import { defineConfig } from "eslint/config";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslintReact.configs["strict-type-checked"]],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@eslint-react/hooks-extra/exhaustive-deps": "off",
    },
  },
  reactHooks.configs.flat["recommended"],
]);
