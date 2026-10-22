import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
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
      <main className="grid place-items-center">
        <Wrapper className="mt-20 mb-36 w-full max-w-xl text-center">
          <h1 className="mb-12 text-center text-5xl font-bold">Anmelden</h1>
          <Suspense fallback={<LoadingIndicator />}>
            <LoginContent />
          </Suspense>
        </Wrapper>
      </main>

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
