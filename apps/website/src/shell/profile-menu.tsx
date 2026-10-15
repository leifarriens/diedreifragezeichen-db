"use client";

import { Avatar } from "@base-ui/react/avatar";
import { Popover } from "@base-ui/react/popover";
import { l } from "@ddfdb/core/labels";
import Link from "next/link";

import { QSvg } from "@/components/icons/q";
import { useSignOut } from "@/features/auth/use-sign-out";

interface ProfileMenuProps {
  name: string | undefined;
}

const iconStyle = { height: 20, width: 20 };

const profileLinks = [
  {
    href: "/profil",
    icon: (
      <svg
        fill="currentColor"
        style={iconStyle}
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
      </svg>
    ),
    label: l.MISC.PROFILE,
  },
  {
    href: "/profil/ratings",
    icon: <QSvg style={iconStyle} />,
    label: l.RATINGS.NAME,
  },
  {
    href: "/profil/listened",
    icon: (
      <svg
        fill="currentColor"
        style={iconStyle}
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
      </svg>
    ),
    label: l.LISTENED.NAME,
  },
  {
    href: "/profil/bookmarks",
    icon: (
      <svg
        fill="currentColor"
        style={iconStyle}
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
      </svg>
    ),
    label: l.BOOKMARKS.NAME,
  },
  {
    href: "/profil/account",
    icon: (
      <svg
        fill="currentColor"
        style={iconStyle}
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
      </svg>
    ),
    label: l.MISC.ACCOUNT,
  },
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
        className="inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Avatar.Root className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/20 align-middle text-sm leading-none font-normal text-white backdrop-blur-2xl select-none">
          <Avatar.Fallback
            className="flex size-full items-center justify-center text-base font-medium"
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
              {profileLinks.map(({ href, icon, label }) => (
                <Popover.Close
                  key={href}
                  nativeButton={false}
                  render={
                    <Link
                      className="flex items-center px-4 py-3 text-sm hover:bg-[#011528] focus-visible:bg-[#011528] focus-visible:outline-none"
                      href={href}
                    >
                      <span className="mr-2">{icon}</span>
                      {label}
                    </Link>
                  }
                />
              ))}
              <hr className="border-neutral-500" />
              <Popover.Close
                render={
                  <button
                    className="flex w-full cursor-pointer px-4 py-3 text-sm hover:bg-[#011528] focus-visible:bg-[#011528] focus-visible:outline-none"
                    onClick={onSignOutPress}
                    type="button"
                  >
                    <span className="mr-2">
                      <svg
                        fill="currentColor"
                        style={iconStyle}
                        viewBox="0 0 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>
                      </svg>
                    </span>
                    {l.MISC.LOGOUT}
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
