import { afterEach, expect, it, vi } from "vitest";

import { getLegalPageUrl } from "./legal-page-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

it("builds legal-page URLs from the configured API origin", () => {
  vi.stubEnv("EXPO_PUBLIC_DDFDB_API_URL", "https://www.ddfdb.de/");

  expect(getLegalPageUrl("privacy")).toBe(
    "https://www.ddfdb.de/legal/privacy",
  );
  expect(getLegalPageUrl("sources")).toBe(
    "https://www.ddfdb.de/legal/sources",
  );
});

it("requires the API origin to be configured", () => {
  vi.stubEnv("EXPO_PUBLIC_DDFDB_API_URL", "");

  expect(() => getLegalPageUrl("privacy")).toThrow(
    "EXPO_PUBLIC_DDFDB_API_URL must be configured",
  );
});
