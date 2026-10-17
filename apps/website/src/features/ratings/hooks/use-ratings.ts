import { createRatingHooks } from "@ddfdb/client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useTRPC } from "@/trpc/client";

export const { useUpdateRating, useUserFolgenRating, useUserRatings } =
  createRatingHooks({
    useAuth,
    useTRPC,
  });
