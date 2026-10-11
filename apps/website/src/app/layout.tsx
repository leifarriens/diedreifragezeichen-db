import type { Metadata, Viewport } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ToastProvider } from "@/components/ui/toast/toast";

import "./globals.css";
import { ArchiveFiltersProvider } from "@/features/archive/components/archive-filters-provider";
import { Footer } from "@/shell/footer";
import { HeaderNav } from "@/shell/header-nav";
import { ScrollToTop } from "@/shell/scroll-to-top";
import { TRPCReactProvider } from "@/trpc/client";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  description: "Das Hörspielarchiv der Drei ???.",
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
        <ToastProvider>
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
          </body>
        </ToastProvider>
      </TRPCReactProvider>
    </html>
  );
}
