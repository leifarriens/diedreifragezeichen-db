import "server-only";
import { appRouter, createTRPCContext } from "@ddfdb/user-api";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import { getServerSession } from "@/lib/auth";
import { bookmarkRepository } from "@/lib/bookmark/bookmark.repository";
import { ratingRepository } from "@/lib/rating/rating.repository";

import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

const getTRPCContext = cache(async () => {
  const requestHeaders = await headers();
  const session = await getServerSession();

  return createTRPCContext({
    bookmarks: bookmarkRepository,
    headers: requestHeaders,
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
