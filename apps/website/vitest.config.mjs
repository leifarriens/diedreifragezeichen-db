import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
  test: {
    coverage: {
      include: ["src"],
      reporter: ["text", "text-summary", "lcov"],
    },
    exclude: [...configDefaults.exclude, "tests/**"], // Exclude end-to-end tests
    passWithNoTests: true,
  },
});
