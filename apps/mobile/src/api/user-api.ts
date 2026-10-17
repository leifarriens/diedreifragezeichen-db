import type { AppRouter } from "@ddfdb/user-api";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import { authClient } from "@/features/auth/auth-client";

const configuredBaseUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_API_URL;

if (typeof configuredBaseUrl !== "string" || !configuredBaseUrl) {
  throw new Error("EXPO_PUBLIC_DDFDB_API_URL must be configured");
}

const baseUrl = configuredBaseUrl;

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      async headers() {
        const cookie = await authClient.getCookie();
        return cookie ? { Cookie: cookie } : {};
      },
      url: `${baseUrl.replace(/\/+$/, "")}/api/trpc`,
    }),
  ],
});
