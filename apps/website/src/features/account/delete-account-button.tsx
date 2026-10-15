"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { authClient } from "@/features/auth/auth-client";

export function DeleteAccountButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function handleDeleteAccount() {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await authClient.deleteUser();

      if (result.error) {
        setError(result.error.message ?? "Could not delete your account.");
        return;
      }

      queryClient.clear();
      router.replace("/");
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not delete your account.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!isDeleting) {
          setIsDialogOpen(open);
          if (!open) setError(null);
        }
      }}
      open={isDialogOpen}
    >
      <Dialog.Trigger
        className={buttonVariants({ intent: "danger" })}
        onClick={() => {
          setError(null);
        }}
      >
        Account löschen
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border bg-white p-6 text-zinc-900 shadow-xl">
          <div className="space-y-2">
            <Dialog.Title className="text-lg font-semibold">
              Delete your account?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-600">
              This permanently deletes your account, bookmarks, listening
              history, and ratings. If your session has expired, sign in again
              and retry. This action cannot be undone.
            </Dialog.Description>
          </div>

          {error ? (
            <p className="text-sm text-ddf-red-500" role="alert">
              {error} If your session has expired, sign out and sign back in
              before trying again.
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <Dialog.Close
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50"
              disabled={isDeleting}
            >
              Cancel
            </Dialog.Close>
            <Button
              disabled={isDeleting}
              intent="danger"
              onClick={() => {
                void handleDeleteAccount();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
