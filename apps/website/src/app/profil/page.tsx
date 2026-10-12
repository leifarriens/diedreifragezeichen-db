import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { getMe } from "@/server/queries/user-data";

export default function ProfilePage() {
  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="text-zinc-600">
            You are signed in and can now access your personal account.
          </p>
        </div>
      </div>

      <Suspense fallback={<PageLoadingIndicator />}>
        <ProfileContent />
      </Suspense>
    </section>
  );
}

async function ProfileContent() {
  const user = await getMe();

  return (
    <dl className="grid gap-4 rounded-2xl border p-6 sm:grid-cols-[max-content_1fr]">
      <dt className="font-medium">Name</dt>
      <dd>{user.name}</dd>
      <dt className="font-medium">Email</dt>
      <dd>{user.email}</dd>
      <dt className="font-medium">Email verified</dt>
      <dd>{user.emailVerified ? "Yes" : "No"}</dd>
      <dt className="font-medium">User ID</dt>
      <dd className="font-mono text-sm break-all">{user.id}</dd>
    </dl>
  );
}
