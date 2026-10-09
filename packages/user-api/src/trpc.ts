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
export const ratingScoreSchema = z.number().min(0.5).max(3).multipleOf(0.5);

export const appRouter = createTRPCRouter({
  bookmarks: createTRPCRouter({
    addBookmark: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.bookmarks.addBookmark({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    getUserBookmarks: protectedProcedure.query(({ ctx }) =>
      ctx.bookmarks.getUserBookmarks({ userId: ctx.user.id }),
    ),
    removeBookmark: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.bookmarks.removeBookmark({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
  }),
  listened: createTRPCRouter({
    addListened: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.listened.addListened({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    getUserListened: protectedProcedure.query(({ ctx }) =>
      ctx.listened.getUserListened({ userId: ctx.user.id }),
    ),
    removeListened: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.listened.removeListened({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
  }),
  ratings: createTRPCRouter({
    getAllCommunityRatings: baseProcedure.query(({ ctx }) =>
      ctx.ratings.findAllFolgenCommunityRatings(),
    ),
    getCommunityForFolge: baseProcedure
      .input(z.object({ folgeId }))
      .query(({ ctx, input }) =>
        ctx.ratings.findCommunityFolgenRating({ folgeId: input.folgeId }),
      ),
    getForFolge: protectedProcedure
      .input(z.object({ folgeId }))
      .query(({ ctx, input }) =>
        ctx.ratings.findUserFolgenRating({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    getMine: protectedProcedure.query(({ ctx }) =>
      ctx.ratings.findAllUserRatings({ userId: ctx.user.id }),
    ),
    remove: protectedProcedure
      .input(z.object({ folgeId }))
      .mutation(({ ctx, input }) =>
        ctx.ratings.removeRating({
          folgeId: input.folgeId,
          userId: ctx.user.id,
        }),
      ),
    set: protectedProcedure
      .input(
        z.object({
          folgeId,
          score: ratingScoreSchema,
        }),
      )
      .mutation(({ ctx, input }) =>
        ctx.ratings.setRating({ ...input, userId: ctx.user.id }),
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
