import { beforeEach, describe, expect, it, vi } from "vitest";

const { createTRPCContext, fetchRequestHandler, getSession } = vi.hoisted(() => ({
  createTRPCContext: vi.fn(),
  fetchRequestHandler: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("@ddfdb/user-api", () => ({ appRouter: {}, createTRPCContext }));
vi.mock("@trpc/server/adapters/fetch", () => ({ fetchRequestHandler }));
vi.mock("@/server/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/server/repositories/bookmark/bookmark.repository", () => ({
  bookmarkRepository: {},
}));
vi.mock("@/server/repositories/listened/listened.repository", () => ({
  listenedRepository: {},
}));
vi.mock("@/server/repositories/rating/rating.repository", () => ({
  ratingRepository: {},
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  fetchRequestHandler.mockImplementation(async ({
    createContext,
  }: {
    createContext: () => Promise<unknown>;
  }) => {
    await createContext();
    return new Response("result", { headers: { "Content-Type": "text/plain" } });
  });
});

describe("tRPC session handling", () => {
  it("checks the session without refreshing cookies outside the auth client", async () => {
    getSession.mockResolvedValue({ user: { id: "user" } });
    const request = new Request("https://example.com/api/trpc/user.me", {
      headers: { cookie: "session=old" },
    });

    const response = await GET(request);

    expect(getSession).toHaveBeenCalledWith({
      headers: request.headers,
      query: { disableRefresh: true },
    });
    expect(createTRPCContext).toHaveBeenCalledWith(
      expect.objectContaining({ user: { id: "user" } }),
    );
    expect(await response.text()).toBe("result");
  });

  it("handles an unauthenticated request", async () => {
    getSession.mockResolvedValue(null);

    const response = await GET(new Request("https://example.com/api/trpc/user.me"));

    expect(response.headers.getSetCookie()).toEqual([]);
    expect(createTRPCContext).toHaveBeenCalledWith(
      expect.objectContaining({ user: null }),
    );
  });
});
