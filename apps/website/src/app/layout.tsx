import type { Metadata, Viewport } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/footer";

import "./globals.css";
import { HeaderNav } from "@/components/layout/header-nav";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { ArchiveFiltersProvider } from "@/features/archive/components/archive-filters-provider";
import { TRPCReactProvider } from "@/trpc/client";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  description: "Das Hörspielarchiv der drei ???.",
  title: {
    default: "Drei Fragezeichen DB",
    template: "%s | Drei Fragezeichen DB",
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
      <TRPCReactProvider>
        <body className="flex min-h-full flex-col">
          <ArchiveFiltersProvider currentYear={CURRENT_YEAR}>
            <HeaderNav />
            <div className="grid flex-1 place-items-center items-stretch justify-items-stretch">
              {children}
            </div>
            <Footer />
            <ScrollToTop />
          </ArchiveFiltersProvider>
          <ReactQueryDevtools
            buttonPosition="bottom-right"
            initialIsOpen={false}
          />
          {/* DISCUSS: Use https://base-ui.com/react/components/toast instead? */}
          <Toaster theme="dark" />
        </body>
      </TRPCReactProvider>
    </html>
  );
}
