import type { Folge } from "@ddfdb/archiv/contracts";
import type { CommunityRating } from "@ddfdb/user-api";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFolgenWithCommunityRating } from "./use-folgen-with-community-rating";

const state = vi.hoisted(() => ({
  archive: {
    data: [] as Folge[],
    error: null as Error | null,
    fetchStatus: "idle",
    isLoading: false,
    isRefetching: false,
    refetch: vi.fn(() => Promise.resolve()),
  },
  ratings: {
    data: [] as CommunityRating[],
    error: null as Error | null,
    fetchStatus: "idle",
    isLoading: false,
    isRefetching: false,
    refetch: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  keepPreviousData: (data: unknown) => data,
  useQueries: ({
    combine,
  }: {
    combine: (queries: [typeof state.archive, typeof state.ratings]) => unknown;
  }) => combine([state.archive, state.ratings]),
  useQuery: vi.fn(),
}));
vi.mock("./archiv", () => ({ archivApi: { getFolgen: vi.fn() } }));
vi.mock("./user-api", () => ({
  useTRPC: () => ({
    ratings: { getAllCommunityRatings: { queryOptions: () => ({}) } },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(state.archive, {
    data: [],
    error: null,
    fetchStatus: "idle",
    isLoading: false,
    isRefetching: false,
  });
  Object.assign(state.ratings, {
    data: [],
    error: null,
    fetchStatus: "idle",
    isLoading: false,
    isRefetching: false,
  });
});

describe("useFolgen collection status", () => {
  it.each(["archive", "ratings"] as const)(
    "exposes %s errors, paused fetches, and refreshes",
    (source) => {
      const error = new Error("Network unavailable");
      Object.assign(state[source], {
        error,
        fetchStatus: "paused",
        isRefetching: true,
      });
      expect(useFolgenWithCommunityRating()).toMatchObject({
        error,
        isPaused: true,
        isRefreshing: true,
      });
    },
  );

  it("refreshes archive metadata and community ratings together", async () => {
    await useFolgenWithCommunityRating().refetch();
    expect(state.archive.refetch).toHaveBeenCalledOnce();
    expect(state.ratings.refetch).toHaveBeenCalledOnce();
  });
});
