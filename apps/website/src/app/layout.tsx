import "./globals.css";

import type { Metadata, Viewport } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ToastProvider } from "@/components/ui/toast/toast";
import { ArchiveSearchStateProvider } from "@/features/archive/context/archive-search-state-provider";
import { Footer } from "@/shell/footer";
import { HeaderNav } from "@/shell/header-nav";
import { ScrollToTop } from "@/shell/scroll-to-top";
import { TRPCReactProvider } from "@/trpc/client";

import { CURRENT_YEAR, SITE_DESCRIPTION, SITE_NAME } from "./constants";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#001727",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="h-full antialiased" lang="de">
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />

      <TRPCReactProvider>
        <ToastProvider>
          <body className="flex min-h-full flex-col">
            <ArchiveSearchStateProvider currentYear={CURRENT_YEAR}>
              <HeaderNav />
              <div className="grid flex-1 place-items-center items-stretch justify-items-stretch">
                {children}
              </div>
              <Footer />
              <ScrollToTop />
            </ArchiveSearchStateProvider>
            <ReactQueryDevtools
              buttonPosition="bottom-right"
              initialIsOpen={false}
            />
          </body>
        </ToastProvider>
      </TRPCReactProvider>
    </html>
  );
}
