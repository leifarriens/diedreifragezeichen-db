// @ts-check

import { defineConfig } from "eslint/config";
import baseConfig from "@ddfdb/eslint-config/base";
import reactConfig from "@ddfdb/eslint-config/react";

export default defineConfig([
  {
    ignores: [
      ".nitro/**",
      ".output/**",
      ".expo/**",
      "expo-env.d.ts",
      "eslint.config.mjs",
      "metro.config.js",
      "postcss.config.js",
      "postcss.config.mjs",
    ],
  },
  baseConfig,
  reactConfig,
]);
