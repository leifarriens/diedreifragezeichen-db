import { createAuthHooks } from "@ddfdb/client";

import { authClient } from "../auth-client";

export const { useSignIn } = createAuthHooks(authClient);

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  return {
    isAuthenticated: !!session,
    isPending,
    session,
  };
}
