"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button/button";
import { authClient } from "@/features/auth/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState<null | string>(null);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  async function signOut() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message ?? "Could not sign out.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not sign out.",
      );
    } finally {
      setIsPending(false);
      queryClient.clear();
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button disabled={isPending} onClick={() => void signOut()}>
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
