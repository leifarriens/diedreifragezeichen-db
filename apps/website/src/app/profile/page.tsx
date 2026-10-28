import type { Metadata } from "next";

import { formatRelativeTime } from "@ddfdb/core";
import Link from "next/link";
import { Suspense } from "react";

import { GearIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { ProfileCollections } from "@/features/profile/components/profile-collections";
import { getMe } from "@/server/queries/user-data";

const TITLE = "Profil";

export const metadata: Metadata = {
  title: TITLE,
};

export default function ProfilePage() {
  return (
    <Wrapper className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <ProfileData />
      </Suspense>
    </Wrapper>
  );
}

async function ProfileData() {
  const [user] = await Promise.all([getMe()]);

  return (
    <div className="space-y-16">
      <Card className="flex">
        <div className="flex grow gap-x-4">
          <Avatar name={user.name} size="large" />
          <div>
            <p className="text-xl font-bold">{user.name}</p>
            <p>Beigetreten {formatRelativeTime(user.createdAt)}</p>
          </div>
        </div>
        <div>
          <Link href="/profile/account" title="Kontoeinstellungen">
            <GearIcon className="size-6" />
          </Link>
        </div>
      </Card>

      <ProfileCollections />
    </div>
  );
}
