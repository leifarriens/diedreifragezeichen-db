import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { betterAuth } = vi.hoisted(() => ({
  betterAuth: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@ddfdb/db", () => ({ db: {}, schema: {} }));
vi.mock("@better-auth/drizzle-adapter", () => ({
  drizzleAdapter: vi.fn(() => ({})),
}));
vi.mock("better-auth", () => ({ betterAuth }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("BETTER_AUTH_URL", "https://v2.ddfdb.de");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("auth trusted origins", () => {
  it("allows production and preview apps without development origins in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await import("./auth");

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        trustedOrigins: ["https://v2.ddfdb.de", "ddfdb://", "ddfdb-preview://"],
      }),
    );
  });

  it("also allows development and Expo Go origins in development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    await import("./auth");

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        trustedOrigins: [
          "https://v2.ddfdb.de",
          "ddfdb://",
          "ddfdb-preview://",
          "ddfdb-dev://",
          "exp://",
          "exp://**",
          "exp://192.168.*.*:*/**",
        ],
      }),
    );
  });
});
