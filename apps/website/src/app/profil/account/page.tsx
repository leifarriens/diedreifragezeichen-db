import type { Metadata } from "next";

import { formatRelativeTime } from "@ddfdb/core";
import { Suspense } from "react";

import { Wrapper } from "@/components/ui/wrapper";
import { DeleteAccountButton } from "@/features/account/delete-account-button";
import { getMe } from "@/server/queries/user-data";

const TITLE = "Account";

export const metadata: Metadata = {
  title: TITLE,
};

export default function AccountPage() {
  return (
    <Wrapper className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{TITLE}</h1>
      <div className="space-y-16">
        <section>
          <Suspense>
            <AccountData />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h2 className="mb-4 text-2xl font-semibold">Account löschen</h2>
          <p className="text-sm text-neutral-400">
            Deinen Account und alle damit verbundenen persönlichen Daten,
            einschließlich Lesezeichen, Hörverlauf und Bewertungen, dauerhaft
            löschen.
          </p>

          <DeleteAccountButton />
        </section>
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
      <dt className="font-medium">Email</dt>
      <dd>{user.email}</dd>
      <dt className="font-medium">Email verifiziert</dt>
      <dd>{user.emailVerified ? "Ja" : "Nein"}</dd>
      <dt className="font-medium">Beigetreten</dt>
      <dd>{formatRelativeTime(user.createdAt)}</dd>
    </dl>
  );
}
