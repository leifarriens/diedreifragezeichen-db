import type { AppRouter } from "@ddfdb/user-api";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

const configuredBaseUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_USER_API_URL;

if (typeof configuredBaseUrl !== "string" || !configuredBaseUrl) {
  throw new Error("EXPO_PUBLIC_DDFDB_USER_API_URL must be configured");
}

const baseUrl = configuredBaseUrl;

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl.replace(/\/+$/, "")}/api/trpc`,
    }),
  ],
});
