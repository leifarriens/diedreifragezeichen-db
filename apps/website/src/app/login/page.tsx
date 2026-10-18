import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
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
        <section className="w-full max-w-lg rounded-3xl border border-ddf-blue-900 bg-ddf-blue-900 px-16 py-14 shadow-2xl backdrop-blur-2xl">
          <h1 className="mb-10 text-center text-4xl font-bold">Anmelden</h1>
          <Suspense fallback={<LoadingIndicator />}>
            <LoginContent />
          </Suspense>
        </section>
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
