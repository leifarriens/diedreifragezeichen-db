import type { Metadata } from "next";

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
    <main className="flex flex-1 justify-center p-6 sm:p-10">
      <div className="w-full max-w-5xl space-y-8">{children}</div>
    </main>
  );
}
