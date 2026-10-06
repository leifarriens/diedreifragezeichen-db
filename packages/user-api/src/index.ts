import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

export interface AuthenticatedUser {
  email: string;
  emailVerified: boolean;
  id: string;
  name: string;
}

export interface CommunityRating {
  folgeId: number;
  numberOfRatings: number;
  score: number;
}

export interface Rating {
  folgeId: number;
  score: number;
  updatedAt: string;
}

export interface RatingRepository {
  getCommunityRatingForFolge(input: {
    folgeId: number;
  }): Promise<CommunityRating | null>;
  getRating(input: { folgeId: number; userId: string }): Promise<null | Rating>;
  getRatingsForUser(input: { userId: string }): Promise<Rating[]>;
  removeRating(input: { folgeId: number; userId: string }): Promise<void>;
  setRating(input: {
    folgeId: number;
    score: number;
    userId: string;
  }): Promise<Rating>;
}

export const createTRPCContext = (opts: {
  headers: Headers;
  ratings: RatingRepository;
  user: AuthenticatedUser | null;
}) => ({
  headers: opts.headers,
  ratings: opts.ratings,
  user: opts.user,
});

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
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

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({ greeting: `hello ${input.text}` })),
  ratings: createTRPCRouter({
    getCommunityForFolge: baseProcedure
      .input(z.object({ folgeId }))
      .query(({ ctx, input }) =>
        ctx.ratings.getCommunityRatingForFolge({ folgeId: input.folgeId }),
      ),
    getForFolge: protectedProcedure
      .input(z.object({ folgeId }))
      .query(({ ctx, input }) =>
        ctx.ratings.getRating({ folgeId: input.folgeId, userId: ctx.user.id }),
      ),
    getMine: protectedProcedure.query(({ ctx }) =>
      ctx.ratings.getRatingsForUser({ userId: ctx.user.id }),
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
          score: z.number().int().min(1).max(6),
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
