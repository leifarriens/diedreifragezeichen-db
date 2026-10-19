import { createRatingHooks } from "@ddfdb/client";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const { useUpdateRating, useUserFolgenRating, useUserRatings } =
  createRatingHooks({
    useAuth,
    useTRPC,
  });
