import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { LoginForm } from "@/features/auth/components/login-form";
import { getServerSession } from "@/server/auth";
import { PageBackground } from "@/shell/page-background";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={<PageLoadingIndicator />}>
        <main className="mt-32">
          <Wrapper className="w-full max-w-xl text-center">
            <h1 className="mb-12 text-center text-5xl font-bold">Anmelden</h1>

            <LoginContent />
          </Wrapper>
        </main>
      </Suspense>

      <PageBackground
        animate={false}
        artwork="https://dreimetadaten.de/data/Serie/078/artwork.webp"
      />
    </>
  );
}

async function LoginContent() {
  const session = await getServerSession();

  if (session) {
    redirect("/profil");
  }

  return <LoginForm />;
}
