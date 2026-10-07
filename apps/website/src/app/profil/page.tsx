import { serverSessionGuard } from "@/lib/auth";
import { caller } from "@/trpc/server";

import { SignOutButton } from "./sign-out-button";

export default async function ProfilePage() {
  await serverSessionGuard();

  const user = await caller.user.me();

  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            You are signed in and can now access your personal account.
          </p>
        </div>
        <SignOutButton />
      </div>
      <dl className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-[max-content_1fr] dark:border-white/15 dark:bg-zinc-900">
        <dt className="font-medium">Name</dt>
        <dd>{user.name}</dd>
        <dt className="font-medium">Email</dt>
        <dd>{user.email}</dd>
        <dt className="font-medium">Email verified</dt>
        <dd>{user.emailVerified ? "Yes" : "No"}</dd>
        <dt className="font-medium">User ID</dt>
        <dd className="font-mono text-sm break-all">{user.id}</dd>
      </dl>
    </section>
  );
}
