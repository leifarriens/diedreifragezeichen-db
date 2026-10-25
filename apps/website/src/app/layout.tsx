import "./globals.css";

import type { Metadata, Viewport } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ToastProvider } from "@/components/ui/toast/toast";
import { ArchiveSearchStateProvider } from "@/features/archive/context/archive-search-state-provider";
import { Footer } from "@/shell/footer";
import { HeaderNav } from "@/shell/header-nav";
import { ScrollToTop } from "@/shell/scroll-to-top";
import { TRPCReactProvider } from "@/trpc/client";

import {
  INITIAL_CURRENT_YEAR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "./constants";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "de_DE",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    type: "website",
    url: SITE_URL,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#001727",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="h-full antialiased" lang="de">
      <TRPCReactProvider>
        <ToastProvider>
          <ArchiveSearchStateProvider currentYear={INITIAL_CURRENT_YEAR}>
            <body>
              <div className="flex min-h-dvh flex-col">
                <HeaderNav />
                <div className="grid flex-1 place-items-center items-stretch justify-items-stretch">
                  {children}
                </div>
              </div>
              <Footer />
              <ScrollToTop />
              <ReactQueryDevtools
                buttonPosition="bottom-right"
                initialIsOpen={false}
              />
            </body>
          </ArchiveSearchStateProvider>
        </ToastProvider>
      </TRPCReactProvider>
    </html>
  );
}
