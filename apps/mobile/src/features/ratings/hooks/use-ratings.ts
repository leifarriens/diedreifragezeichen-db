import { createRatingHooks } from "@ddfdb/client";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/lib/use-auth";

export const { useUpdateRating, useUserRatings } = createRatingHooks({
  useAuth,
  useTRPC,
});
