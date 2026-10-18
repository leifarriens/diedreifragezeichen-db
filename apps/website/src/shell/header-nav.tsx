"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn } from "tailwind-variants";

import { Button } from "@/components/ui/button/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { GlobalSearchInput } from "@/features/global-search/components/global-search-input";

import styles from "./header-nav.module.css";
import { ProfileMenu } from "./profile-menu";

export function HeaderNav() {
  const pathname = usePathname();
  const isScrolled = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("scroll", onStoreChange, { passive: true });
      return () => {
        window.removeEventListener("scroll", onStoreChange);
      };
    },
    () => window.scrollY > 0,
    () => false,
  );

  const { isAuthenticated, isPending, session } = useAuth();

  const isLoginPage = pathname === "/login";

  return (
    <div className="pointer-events-none sticky top-0 z-40 mb-6 w-full lg:px-4 lg:py-6 2xl:px-8">
      <div
        className={cn(
          styles.header,
          "grid justify-end gap-x-4 gap-y-5 border-b border-transparent px-6 py-6 transition-all duration-300 sm:px-8 lg:rounded-xl lg:px-8 2xl:px-12",
          {
            "border-blue-900/30 bg-blue-400/10 shadow-lg backdrop-blur-xl backdrop-brightness-50":
              isScrolled,
          },
        )}
      >
        <Link
          aria-label="Drei Fragezeichen DB Startseite"
          className="flex shrink-0 items-center gap-3 [grid-area:logo]"
          href="/"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.scroll({ behavior: "smooth", top: 0 });
            }
          }}
        >
          <Image
            alt="DDFDB"
            className="object-contain transition-transform ease-out hover:scale-110"
            height={360}
            preload
            src="/ddfdb-logo.png"
            width={540}
          />
        </Link>

        {!isLoginPage && (
          <GlobalSearchInput className="min-w-0 [grid-area:search]" />
        )}

        {!isLoginPage && (
          <nav
            aria-label="Hauptnavigation"
            className="flex shrink-0 grow basis-auto items-center justify-end [grid-area:profile]"
          >
            {isPending ? null : isAuthenticated ? (
              <ProfileMenu name={session?.user.name} />
            ) : (
              <Button href="/login">Anmelden</Button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
