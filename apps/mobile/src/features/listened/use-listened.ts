import { createListenedHooks } from "@ddfdb/client";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/features/auth/use-auth";

export const { useUpdateFolgenListenStatus, useUserListened } =
  createListenedHooks({
    useAuth,
    useTRPC,
  });
