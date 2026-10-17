import type { Metadata } from "next";

import { serverSessionGuard } from "@/server/auth";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default async function ProfilLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await serverSessionGuard();

  return <main className="flex flex-1 justify-center">{children}</main>;
}
