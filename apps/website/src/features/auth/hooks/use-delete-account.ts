import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authClient } from "../auth-client";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser();

      if (result.error) {
        throw new Error(
          result.error.message ?? "Could not delete your account.",
        );
      }
    },
    onSuccess() {
      queryClient.clear();
    },
  });
}
