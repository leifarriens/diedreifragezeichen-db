import type { Metadata } from "next";

import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { serverSessionGuard } from "@/server/auth";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function ProfilLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={<PageLoadingIndicator ariaLabel="Sitzung wird überprüft" />}
    >
      <AuthenticatedProfile>{children}</AuthenticatedProfile>
    </Suspense>
  );
}

async function AuthenticatedProfile({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await serverSessionGuard();

  return <main className="flex flex-1 justify-center">{children}</main>;
}
