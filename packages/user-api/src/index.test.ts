import { describe, expect, it, vi } from "vitest";

import type {
  AuthenticatedUser,
  BookmarkRepository,
  ListenedRepository,
  RatingRepository,
} from "./index";

import { appRouter } from "./index";

const authenticatedUser: AuthenticatedUser = {
  createdAt: new Date("2026-10-06T00:19:12.403Z"),
  email: "person@example.com",
  emailVerified: true,
  id: "user-123",
  name: "Person",
};
const updatedAt = "2026-10-06T00:19:12.403Z";

function createCaller(
  user: AuthenticatedUser | null = null,
  ratings: RatingRepository = makeRatingRepository(),
  bookmarks: BookmarkRepository = makeBookmarkRepository(),
  listened: ListenedRepository = makeListenedRepository(),
) {
  return appRouter.createCaller({
    bookmarks,
    headers: new Headers(),
    listened,
    ratings,
    user,
  });
}

function makeBookmarkRepository() {
  return {
    createBookmark: vi.fn(),
    deleteBookmark: vi.fn(() => Promise.resolve()),
    findBookmarksByUserId: vi.fn(() => Promise.resolve([])),
  } satisfies BookmarkRepository;
}

function makeListenedRepository() {
  return {
    findListenedFolgenByUserId: vi.fn(() => Promise.resolve([])),
    markFolgeAsListened: vi.fn(),
    markFolgeAsNotListened: vi.fn(() => Promise.resolve()),
  } satisfies ListenedRepository;
}

function makeRatingRepository() {
  return {
    deleteUserRating: vi.fn(() => Promise.resolve()),
    findAllFolgenCommunityRatings: vi.fn(() => Promise.resolve([])),
    findUserRatingsByUserId: vi.fn(() => Promise.resolve([])),
    upsertUserRating: vi.fn(
      ({
        folgeId,
        score,
      }: {
        folgeId: number;
        score: number;
        userId: string;
      }) => Promise.resolve({ folgeId, score, updatedAt }),
    ),
  } satisfies RatingRepository;
}

describe("user API router", () => {
  it("rejects protected requests without a session", async () => {
    const caller = createCaller();

    await expect(caller.user.me()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(caller.ratings.getMyRatings()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(caller.listened.getMyListenedFolgen()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("adds, lists, and removes listened Folgen for the authenticated user", async () => {
    const listened = makeListenedRepository();
    const caller = createCaller(
      authenticatedUser,
      undefined,
      undefined,
      listened,
    );

    await caller.listened.markFolgeAsListened({ folgeId: 12 });
    expect(listened.markFolgeAsListened).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });

    await caller.listened.getMyListenedFolgen();
    expect(listened.findListenedFolgenByUserId).toHaveBeenCalledWith({
      userId: authenticatedUser.id,
    });

    await caller.listened.markFolgeAsNotListened({ folgeId: 12 });
    expect(listened.markFolgeAsNotListened).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });
  });

  it("returns the authenticated user's public information", async () => {
    const caller = createCaller(authenticatedUser);

    await expect(caller.user.me()).resolves.toEqual(authenticatedUser);
  });

  it("sets a rating for the authenticated user", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.upsertMyRating({ folgeId: 12, score: 2.5 }),
    ).resolves.toEqual({ folgeId: 12, score: 2.5, updatedAt });
    expect(ratings.upsertUserRating).toHaveBeenCalledWith({
      folgeId: 12,
      score: 2.5,
      userId: authenticatedUser.id,
    });
  });

  it("removes the authenticated user's rating", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.deleteMyRating({ folgeId: 12 }),
    ).resolves.toBeUndefined();
    expect(ratings.deleteUserRating).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });
  });

  it("rejects scores outside the supported range", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.upsertMyRating({ folgeId: 12, score: 11 }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(ratings.upsertUserRating).not.toHaveBeenCalled();
  });
});
