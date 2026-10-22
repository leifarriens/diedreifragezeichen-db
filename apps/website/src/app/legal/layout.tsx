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
    <main>
      <Wrapper className="max-w-4xl">
        <article className="mx-auto prose prose-sm max-w-none prose-invert sm:prose-base">
          {children}
        </article>
      </Wrapper>
    </main>
  );
}
