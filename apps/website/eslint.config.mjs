import baseConfig from "@ddfdb/eslint-config/base";
import reactConfig from "@ddfdb/eslint-config/react";
import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  // Keep Next's framework rules, while using the plugin instances and TypeScript
  // rules already provided by our shared config.
  ...nextVitals
    .filter((config) => config.name !== "next/typescript")
    .map((config) => {
      if (!config.plugins) return config;

      return {
        ...config,
        plugins: Object.fromEntries(
          Object.entries(config.plugins).filter(
            ([name]) => name !== "react-hooks",
          ),
        ),
      };
    }),
  ...baseConfig,
  ...reactConfig,
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
