import { redirect } from "next/navigation";

import { archivApi } from "@/lib/archiv-api";
import { getServerSession } from "@/lib/auth";
import { caller } from "@/trpc/server";

import { SignOutButton } from "./sign-out-button";
import { UserRatedFolgen } from "./user-rated-folgen";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const [user, userRatings, folgen] = await Promise.all([
    caller.user.me(),
    caller.ratings.getMine(),
    archivApi.getFolgen(),
  ]);

  const userRatingsByFolgeId = new Map(
    userRatings.map((rating) => [rating.folgeId, rating]),
  );

  const folgenWithRating = folgen.flatMap((folge) => {
    const userRating = userRatingsByFolgeId.get(folge.id);

    return userRating
      ? [
          {
            ...folge,
            userRating: userRating.score,
            userRatingUpdatedAt: userRating.updatedAt,
          },
        ]
      : [];
  });

  return (
    <main className="flex flex-1 justify-center p-6 sm:p-10">
      <section className="w-full max-w-4xl space-y-8">
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

        <UserRatedFolgen folgen={folgenWithRating} />
      </section>
    </main>
  );
}
