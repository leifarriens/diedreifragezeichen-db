import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Wrapper } from "@/components/ui/wrapper";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <main className="container flex-1 pt-8">
      <Wrapper>
        <article className="prose prose-invert lg:prose-lg">{children}</article>
      </Wrapper>
    </main>
  );
}
