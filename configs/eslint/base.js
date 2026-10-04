// @ts-check

import eslint from "@eslint/js";
import turboConfig from "eslint-config-turbo/flat";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import * as path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  turboConfig,
  perfectionist.configs["recommended-natural"],
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
]);
