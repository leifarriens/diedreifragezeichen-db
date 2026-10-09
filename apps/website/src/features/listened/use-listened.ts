import { createListenedHooks } from "@ddfdb/client";

import { useAuth } from "@/lib/use-auth";
import { useTRPC } from "@/trpc/client";

export const { useUpdateFolgenListenStatus, useUserListened } =
  createListenedHooks({
    useAuth,
    useTRPC,
  });
