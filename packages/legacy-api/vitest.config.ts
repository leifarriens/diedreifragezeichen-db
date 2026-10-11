import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src"],
      reporter: ["text", "text-summary", "lcov"]
    },
    passWithNoTests: true,
  },
});
