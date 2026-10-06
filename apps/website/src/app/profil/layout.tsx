import Link from "next/link";

export default function ProfilLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-1 justify-center p-6 sm:p-10">
      <div className="w-full max-w-4xl space-y-8">
        <nav className="flex gap-x-2">
          <Link href="/profil">Profile</Link>
          <Link href="/profil/bookmarks">Gespeichert</Link>
        </nav>

        {children}
      </div>
    </main>
  );
}
