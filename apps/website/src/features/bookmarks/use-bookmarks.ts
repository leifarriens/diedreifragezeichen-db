import { createBookmarkHooks } from "@ddfdb/client";

import { useAuth } from "@/features/auth/use-auth";
import { useTRPC } from "@/trpc/client";

export const { useUpdateFolgenBookmark, useUserBookmarks } =
  createBookmarkHooks({ useAuth, useTRPC });
