"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { useDeleteAccount } from "@/features/auth/hooks/use-delete-account";

export function DeleteAccountButton() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteAccountMutation = useDeleteAccount();

  function handleDeleteAccount() {
    deleteAccountMutation.mutate(undefined, {
      onSuccess() {
        router.replace("/");
        router.refresh();
      },
    });
  }

  const isDeleting = deleteAccountMutation.isPending;
  const error = deleteAccountMutation.error?.message ?? null;

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!isDeleting) {
          setIsDialogOpen(open);
        }
      }}
      open={isDialogOpen}
    >
      <Dialog.Trigger className={buttonVariants({ intent: "danger" })}>
        Account löschen
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border bg-ddf-blue-950 p-6 text-neutral-100 shadow-xl">
          <div className="space-y-2">
            <Dialog.Title className="text-lg font-semibold">
              Willst du deinen Account wirklich löschen?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-neutral-400">
              Diese Aktion löscht dauerhaft deinen Account, Lesezeichen,
              Hörverlauf und Bewertungen.{" "}
              <b>Diese Aktion kann nicht rückgängig gemacht werden.</b>
            </Dialog.Description>
          </div>

          {error ? (
            <p className="text-sm text-ddf-red-500" role="alert">
              {error} Wenn deine Sitzung abgelaufen ist, melde dich ab und
              wieder an, bevor du es erneut versuchst.
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <Dialog.Close
              className={buttonVariants({ intent: "default" })}
              disabled={isDeleting}
            >
              Abbrechen
            </Dialog.Close>
            <Button
              disabled={isDeleting}
              intent="danger"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Account dauerhaft löschen
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
