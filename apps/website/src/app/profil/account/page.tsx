import type { Metadata } from "next";

import { formatRelativeTime } from "@ddfdb/core";
import { Suspense } from "react";

import { DeleteAccountButton } from "@/features/account/delete-account-button";
import { getMe } from "@/server/queries/user-data";

const TITLE = "Account";

export const metadata: Metadata = {
  title: TITLE,
};

export default function AccountPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>

      <main className="rounded-2xl border border-neutral-500">
        <section className="space-y-4 border-b border-neutral-500 p-6">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <Suspense>
            <AccountData />
          </Suspense>
        </section>

        <section className="space-y-4 p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Account löschen</h2>
            <p className="text-sm text-neutral-400">
              Deinen Account und alle damit verbundenen persönlichen Daten,
              einschließlich Lesezeichen, Hörverlauf und Bewertungen, dauerhaft
              löschen.
            </p>
          </div>
          <DeleteAccountButton />
        </section>
      </main>
    </>
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
      <dt className="font-medium">Account erstellt</dt>
      <dd>{formatRelativeTime(user.createdAt)}</dd>
    </dl>
  );
}
