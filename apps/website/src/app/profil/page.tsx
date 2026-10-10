import { SignOutButton } from "@/features/auth/sign-out-button";
import { serverSessionGuard } from "@/server/auth";
import { caller } from "@/trpc/server";

export default async function ProfilePage() {
  await serverSessionGuard();

  const user = await caller.user.me();

  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="text-zinc-600">
            You are signed in and can now access your personal account.
          </p>
        </div>
        <SignOutButton />
      </div>
      <dl className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-[max-content_1fr]">
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
