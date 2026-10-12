import type { Metadata } from "next";

import { Wrapper } from "@/components/ui/wrapper";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function DatenschutzPage() {
  return (
    <main className="flex flex-1 justify-center">
      <Wrapper className="max-w-5xl space-y-8">
        <h1>Datenschutzerklärung</h1>
      </Wrapper>
    </main>
  );
}
