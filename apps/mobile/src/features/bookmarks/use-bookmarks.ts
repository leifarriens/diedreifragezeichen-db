import { createBookmarkHooks } from "@ddfdb/client";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const { useUpdateFolgenBookmark, useUserBookmarks } =
  createBookmarkHooks({ useAuth, useTRPC });
