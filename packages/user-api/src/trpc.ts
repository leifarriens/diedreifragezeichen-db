import {
  FOLGEN_RATING_MAX,
  FOLGEN_RATING_MIN,
  FOLGEN_RATING_STEP,
} from "@ddfdb/core";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

import type { BookmarkRepository } from "./modules/bookmark/bookmark.repository.interface";
import type { ListenedRepository } from "./modules/listened/listened.repository.interface";
import type { RatingRepository } from "./modules/rating/rating.repository.interface";

export interface AuthenticatedUser {
  email: string;
  emailVerified: boolean;
  id: string;
  name: string;
}

export const createTRPCContext = (opts: {
  bookmarks: BookmarkRepository;
  headers: Headers;
  listened: ListenedRepository;
  ratings: RatingRepository;
  user: AuthenticatedUser | null;
}) => ({
  bookmarks: opts.bookmarks,
  headers: opts.headers,
  listened: opts.listened,
  ratings: opts.ratings,
  user: opts.user,
});

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

const createTRPCRouter = t.router;
const baseProcedure = t.procedure;

const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

const folgeId = z.int().positive().max(2_147_483_647);
export const ratingScoreSchema = z
  .number()
  .min(FOLGEN_RATING_MIN)
  .max(FOLGEN_RATING_MAX)
  .multipleOf(FOLGEN_RATING_STEP);

export const appRouter = createTRPCRouter({
  bookmarks: createTRPCRouter({
    addBookmark: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.bookmarks.createBookmark({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    getMyBookmarks: protectedProcedure.query(({ ctx }) =>
      ctx.bookmarks.findBookmarksByUserId({ userId: ctx.user.id }),
    ),
    removeBookmark: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.bookmarks.deleteBookmark({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
  }),
  listened: createTRPCRouter({
    getMyListenedFolgen: protectedProcedure.query(({ ctx }) =>
      ctx.listened.findListenedFolgenByUserId({ userId: ctx.user.id }),
    ),
    markFolgeAsListened: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.listened.markFolgeAsListened({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    markFolgeAsNotListened: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.listened.markFolgeAsNotListened({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
  }),
  ratings: createTRPCRouter({
    deleteMyRating: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.ratings.deleteUserRating({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    getAllCommunityRatings: baseProcedure.query(({ ctx }) =>
      ctx.ratings.findAllCommunityRatings(),
    ),
    getCommunityRatingForFolge: baseProcedure
      .input(z.object({ folgeId }))
      .query(({ ctx, input }) =>
        ctx.ratings.findCommunityRatingByFolgeId({ folgeId: input.folgeId }),
      ),
    getMyRatings: protectedProcedure.query(({ ctx }) =>
      ctx.ratings.findUserRatingsByUserId({ userId: ctx.user.id }),
    ),
    upsertMyRating: protectedProcedure
      .input(
        z.object({
          folgeId,
          score: ratingScoreSchema,
        }),
      )
      .mutation(({ ctx, input }) =>
        ctx.ratings.upsertUserRating({ ...input, userId: ctx.user.id }),
      ),
  }),
  user: createTRPCRouter({
    me: protectedProcedure.query(({ ctx }) => ({
      email: ctx.user.email,
      emailVerified: ctx.user.emailVerified,
      id: ctx.user.id,
      name: ctx.user.name,
    })),
  }),
});

export type AppRouter = typeof appRouter;
