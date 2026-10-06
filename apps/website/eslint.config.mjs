import baseConfig from "@ddfdb/eslint-config/base";
import reactConfig from "@ddfdb/eslint-config/react";
import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...reactConfig,
  // TODO: Fix that next configs work with our @ddfdb/eslint-config
  // ...nextVitals,
  // ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
