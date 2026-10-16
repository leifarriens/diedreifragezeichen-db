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
      <Wrapper className="">
        <article className="mx-auto prose max-w-5xl prose-invert">
          {children}
        </article>
      </Wrapper>
    </main>
  );
}
