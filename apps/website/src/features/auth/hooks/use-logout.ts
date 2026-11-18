import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast/toast";

import { useSignOut } from "./use-auth";

export function useLogout() {
  const signOut = useSignOut();
  const router = useRouter();
  const toast = useToast();

  function logout() {
    signOut.mutate(undefined, {
      onError() {
        toast.add({
          title: "Abmelden fehlgeschlagen",
        });
      },
      onSuccess() {
        router.replace("/login");
        router.refresh();
      },
    });
  }

  return { isLoggingOut: signOut.isPending, logout };
}
