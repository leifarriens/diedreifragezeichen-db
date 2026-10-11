"use client";
import { Avatar } from "@base-ui/react/avatar";
import { Popover } from "@base-ui/react/popover";
import Link from "next/link";

import { useSignOut } from "@/features/auth/use-sign-out";

interface ProfileMenuProps {
  name: string | undefined;
}

const profileLinks = [
  { href: "/profil", label: "Profil" },
  { href: "/profil/ratings", label: "Bewertungen" },
  { href: "/profil/listened", label: "Gehört" },
  { href: "/profil/bookmarks", label: "Gespeichert" },
];

export function ProfileMenu({ name }: ProfileMenuProps) {
  const initials = name?.trim().slice(0, 2).toUpperCase() ?? "?";

  const { signOut } = useSignOut();

  function onSignOutPress() {
    void signOut();
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Profilmenü öffnen"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Avatar.Root className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-ddf-blue align-middle text-sm leading-none font-normal text-white select-none">
          <Avatar.Fallback
            className="flex size-full items-center justify-center text-sm"
            delay={600}
          >
            {initials}
          </Avatar.Fallback>
        </Avatar.Root>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          align="end"
          className="z-50 outline-none"
          sideOffset={14}
        >
          <Popover.Popup className="max-h-92 w-56 max-w-(--available-width) overflow-y-auto rounded-xl border border-neutral-500 bg-[#000b0e] text-neutral-300 shadow-2xl">
            <nav aria-label="Profilmenü">
              {profileLinks.map(({ href, label }) => (
                <Popover.Close
                  key={href}
                  nativeButton={false}
                  render={
                    <Link
                      className="flex px-4 py-3 text-sm hover:bg-[#011528] focus-visible:bg-[#011528] focus-visible:outline-none"
                      href={href}
                    >
                      {label}
                    </Link>
                  }
                />
              ))}
              <Popover.Close
                render={
                  <button
                    className="flex w-full cursor-pointer px-4 py-3 text-sm hover:bg-[#011528] focus-visible:bg-[#011528] focus-visible:outline-none"
                    onClick={onSignOutPress}
                    type="button"
                  >
                    Abmelden
                  </button>
                }
              />
            </nav>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
