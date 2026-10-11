import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast/toast";

import { authClient } from "./auth-client";

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const signOutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
    onError(error) {
      console.error(error);

      toast.add({
        title: "Abmelden fehlgeschlagen",
      });
    },
    onSettled() {
      queryClient.clear();
    },
    onSuccess() {
      router.replace("/login");
      router.refresh();
    },
  });

  return {
    error: signOutMutation.error,
    isPending: signOutMutation.isPending,
    signOut: signOutMutation.mutateAsync,
  };
}
