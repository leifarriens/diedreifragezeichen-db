import { redirect } from "next/navigation";

import { PageBackground } from "@/components/layout/page-background";
import { LoginForm } from "@/features/auth/login-form";
import { getServerSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/profil");
  }

  return (
    <>
      <main className="grid place-items-center">
        <section className="rounded-3xl border border-neutral-950 bg-neutral-950/50 px-16 py-16 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-2">
            <h1 className="mb-10 text-center font-serif text-5xl font-semibold">
              Anmelden
            </h1>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Melde dich an, um auf dein Profil, deine Bewertungen und
              gespeicherten Episoden zuzugreifen.
            </p>
          </div>
          <LoginForm />
        </section>
      </main>

      <PageBackground artwork="https://dreimetadaten.de/data/Serie/001/artwork.webp" />
    </>
  );
}
