import { describe, expect, it, vi } from "vitest";

import type { AuthenticatedUser, RatingRepository } from "./index";

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
) {
  return appRouter.createCaller({
    headers: new Headers(),
    ratings,
    user,
  });
}

function makeRatingRepository() {
  return {
    getCommunityRatingForFolge: vi.fn(({ folgeId }: { folgeId: number }) =>
      Promise.resolve({ folgeId, numberOfRatings: 3, score: 4.5 }),
    ),
    getRating: vi.fn(({ folgeId }: { folgeId: number; userId: string }) =>
      Promise.resolve({ folgeId, score: 4, updatedAt }),
    ),
    getRatingsForUser: vi.fn(() => Promise.resolve([])),
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
  it("returns a greeting", async () => {
    const caller = createCaller();

    await expect(caller.hello({ text: "Expo" })).resolves.toEqual({
      greeting: "hello Expo",
    });
  });

  it("rejects protected requests without a session", async () => {
    const caller = createCaller();

    await expect(caller.user.me()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      caller.ratings.getForFolge({ folgeId: 12 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
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
    expect(ratings.getCommunityRatingForFolge).toHaveBeenCalledWith({
      folgeId: 12,
    });
  });

  it("sets a rating for the authenticated user", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(
      caller.ratings.set({ folgeId: 12, score: 6 }),
    ).resolves.toEqual({ folgeId: 12, score: 6, updatedAt });
    expect(ratings.setRating).toHaveBeenCalledWith({
      folgeId: 12,
      score: 6,
      userId: authenticatedUser.id,
    });
  });

  it("gets the authenticated user's rating for a Folge", async () => {
    const ratings = makeRatingRepository();
    const caller = createCaller(authenticatedUser, ratings);

    await expect(caller.ratings.getForFolge({ folgeId: 12 })).resolves.toEqual({
      folgeId: 12,
      score: 4,
      updatedAt,
    });
    expect(ratings.getRating).toHaveBeenCalledWith({
      folgeId: 12,
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
