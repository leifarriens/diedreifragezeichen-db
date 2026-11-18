import type { AppRouter } from "@ddfdb/user-api";
import type { createTRPCContext } from "@trpc/tanstack-react-query";

export type UseTRPC = ReturnType<
  typeof createTRPCContext<AppRouter>
>["useTRPC"];
