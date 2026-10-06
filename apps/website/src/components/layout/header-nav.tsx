"use client";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "tailwind-variants";

import { authClient } from "@/lib/auth-client";

import { Button } from "../button/button";
import { SearchInput } from "../search/search-input";
import styles from "./header-nav.module.css";

export function HeaderNav() {
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
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="sticky top-0 z-50 w-full sm:px-8 sm:py-8">
      <div
        className={cn(
          styles.container,
          "flex items-center justify-end gap-4 px-6 py-8 transition-all duration-300 sm:rounded-xl sm:bg-transparent sm:px-12 sm:py-6",
          {
            "shadow-lg sm:bg-blue-400/10 sm:backdrop-blur-lg": isScrolled,
          },
        )}
      >
        <Link
          aria-label="Drei Fragezeichen DB Startseite"
          className="flex shrink-0 items-center gap-3 [grid-area:logo]"
          href="/#"
        >
          <Image
            alt="Drei Fragezeichen"
            className="h-10 w-[60px] object-contain transition-transform ease-out hover:scale-110"
            height={360}
            priority
            src="/ddfdb-logo.png"
            width={540}
          />
        </Link>

        <SearchInput className="[grid-area:search]" />

        <nav
          aria-label="Hauptnavigation"
          className="flex shrink-0 grow basis-auto items-center justify-end [grid-area:profile]"
        >
          {isPending ? null : session ? (
            <Button href="/profil">Profil</Button>
          ) : (
            <Button href="/login">Anmelden</Button>
          )}
        </nav>
      </div>
    </div>
  );
}
