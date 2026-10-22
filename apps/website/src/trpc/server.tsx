import "server-only";
import { appRouter, createTRPCContext } from "@ddfdb/user-api";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import { getServerSession } from "@/server/auth";
import { bookmarkRepository } from "@/server/repositories/bookmark/bookmark.repository";
import { listenedRepository } from "@/server/repositories/listened/listened.repository";
import { ratingRepository } from "@/server/repositories/rating/rating.repository";

import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

const getTRPCContext = cache(async () => {
  const requestHeaders = await headers();
  const session = await getServerSession();

  return createTRPCContext({
    bookmarks: bookmarkRepository,
    headers: requestHeaders,
    listened: listenedRepository,
    ratings: ratingRepository,
    user: session?.user ?? null,
  });
});

export const trpc = createTRPCOptionsProxy({
  ctx: getTRPCContext,
  queryClient: getQueryClient,
  router: appRouter,
});

export const caller = appRouter.createCaller(getTRPCContext);
