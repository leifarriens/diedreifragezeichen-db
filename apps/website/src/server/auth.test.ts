import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { betterAuth, getSession, headers } = vi.hoisted(() => ({
  betterAuth: vi.fn(),
  getSession: vi.fn(),
  headers: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@ddfdb/db", () => ({ db: {}, schema: {} }));
vi.mock("@better-auth/drizzle-adapter", () => ({
  drizzleAdapter: vi.fn(() => ({})),
}));
vi.mock("better-auth", () => ({ betterAuth }));
vi.mock("next/headers", () => ({ headers }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  betterAuth.mockReturnValue({ api: { getSession } });
  vi.stubEnv("BETTER_AUTH_URL", "https://ddfdb.de");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("auth sessions", () => {
  it("sets a 90-day lifetime and a one-day renewal interval", async () => {
    await import("./auth");

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        session: { expiresIn: 90 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
      }),
    );
  });

  it("does not refresh sessions during server component reads", async () => {
    const requestHeaders = new Headers({ cookie: "session=token" });
    headers.mockResolvedValue(requestHeaders);
    const { getServerSession } = await import("./auth");

    await getServerSession();

    expect(getSession).toHaveBeenCalledWith({
      headers: requestHeaders,
      query: { disableRefresh: true },
    });
  });
});

describe("auth trusted origins", () => {
  it("allows production and preview apps without development origins in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await import("./auth");

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        trustedOrigins: ["https://ddfdb.de", "ddfdb://", "ddfdb-preview://"],
      }),
    );
  });

  it("also allows development and Expo Go origins in development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    await import("./auth");

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        trustedOrigins: [
          "https://ddfdb.de",
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
