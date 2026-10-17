import { authClient } from "./auth-client";

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  return {
    isAuthenticated: !!session,
    isPending,
    session,
  };
}
