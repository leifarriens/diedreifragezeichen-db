import { createListenedHooks } from "@ddfdb/client";

import { useAuth } from "@/features/auth/use-auth";
import { useTRPC } from "@/trpc/client";

export const { useUpdateFolgenListenStatus, useUserListened } =
  createListenedHooks({
    useAuth,
    useTRPC,
  });
