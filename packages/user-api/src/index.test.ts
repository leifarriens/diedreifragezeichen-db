import { describe, expect, it, vi } from "vitest";

import type {
  AuthenticatedUser,
  BookmarkRepository,
  ListenedRepository,
  RatingRepository,
} from "./index";

import { appRouter } from "./index";

const authenticatedUser: AuthenticatedUser = {
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
    addBookmark: vi.fn(),
    getUserBookmarks: vi.fn(() => Promise.resolve([])),
    removeBookmark: vi.fn(() => Promise.resolve()),
  } satisfies BookmarkRepository;
}

function makeListenedRepository() {
  return {
    addListened: vi.fn(),
    getUserListened: vi.fn(() => Promise.resolve([])),
    removeListened: vi.fn(() => Promise.resolve()),
  } satisfies ListenedRepository;
}

function makeRatingRepository() {
  return {
    findAllFolgenCommunityRatings: vi.fn(() => Promise.resolve([])),
    findAllUserRatings: vi.fn(() => Promise.resolve([])),
    findCommunityFolgenRating: vi.fn(({ folgeId }: { folgeId: number }) =>
      Promise.resolve({ folgeId, numberOfRatings: 3, score: 4.5 }),
    ),
    removeRating: vi.fn(() => Promise.resolve()),
    setRating: vi.fn(
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
    await expect(caller.ratings.getMine()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(caller.listened.getUserListened()).rejects.toMatchObject({
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

    await caller.listened.addListened({ folgeId: 12 });
    expect(listened.addListened).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });

    await caller.listened.getUserListened();
    expect(listened.getUserListened).toHaveBeenCalledWith({
      userId: authenticatedUser.id,
    });

    await caller.listened.removeListened({ folgeId: 12 });
    expect(listened.removeListened).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });
  });

  it("returns the authenticated user's public information", async () => {
    const caller = createCaller(authenticatedUser);

    await expect(caller.user.me()).resolves.toEqual(authenticatedUser);
  });

  it("returns the community rating without authentication", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(null, ratings);

    await expect(
      caller.ratings.getCommunityForFolge({ folgeId: 12 }),
    ).resolves.toEqual({ folgeId: 12, numberOfRatings: 3, score: 4.5 });
    expect(ratings.findCommunityFolgenRating).toHaveBeenCalledWith({
      folgeId: 12,
    });
  });

  it("sets a rating for the authenticated user", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.set({ folgeId: 12, score: 2.5 }),
    ).resolves.toEqual({ folgeId: 12, score: 2.5, updatedAt });
    expect(ratings.setRating).toHaveBeenCalledWith({
      folgeId: 12,
      score: 2.5,
      userId: authenticatedUser.id,
    });
  });

  it("removes the authenticated user's rating", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.remove({ folgeId: 12 }),
    ).resolves.toBeUndefined();
    expect(ratings.removeRating).toHaveBeenCalledWith({
      folgeId: 12,
      userId: authenticatedUser.id,
    });
  });

  it("rejects scores outside the supported range", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.set({ folgeId: 12, score: 11 }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(ratings.setRating).not.toHaveBeenCalled();
  });
});
