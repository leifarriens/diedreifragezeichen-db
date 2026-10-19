import type { Metadata } from "next";

import { formatRelativeTime } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { Wrapper } from "@/components/ui/wrapper";
import { DeleteAccountButton } from "@/features/auth/components/delete-account-button";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { getMe } from "@/server/queries/user-data";

export const metadata: Metadata = {
  title: l.MISC.ACCOUNT,
};

export default function AccountPage() {
  return (
    <Wrapper className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{l.MISC.ACCOUNT}</h1>
      <div className="space-y-16">
        <Card>
          <Suspense>
            <AccountData />
          </Suspense>
        </Card>

        <Card className="space-y-4">
          <h2 className="mb-4 text-2xl font-semibold">Abmelden</h2>
          <p className="text-sm text-neutral-400">
            Du kannst dich hier von deinem Konto abmelden.
          </p>

          <LogoutButton />
        </Card>

        <Card className="space-y-4">
          <h2 className="mb-4 text-2xl font-semibold">Konto löschen</h2>
          <p className="text-sm text-neutral-400">
            Dein Konto und alle damit verbundenen persönlichen Daten,
            einschließlich Lesezeichen, Hörverlauf und Bewertungen, dauerhaft
            löschen.
          </p>

          <DeleteAccountButton />
        </Card>
      </div>
    </Wrapper>
  );
}

async function AccountData() {
  const user = await getMe();

  return (
    <dl className="grid gap-4 sm:grid-cols-[max-content_1fr]">
      <dt className="font-medium">Name</dt>
      <dd>{user.name}</dd>
      <dt className="font-medium">E-Mail</dt>
      <dd>{user.email}</dd>
      <dt className="font-medium">E-Mail-Adresse bestätigt</dt>
      <dd>{user.emailVerified ? "Ja" : "Nein"}</dd>
      <dt className="font-medium">Beigetreten</dt>
      <dd>{formatRelativeTime(user.createdAt)}</dd>
    </dl>
  );
}
