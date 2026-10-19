"use client";

import { Popover } from "@base-ui/react/popover";
import { l } from "@ddfdb/core/labels";
import Link from "next/link";

import { GearIcon } from "@/components/icons";
import { QSvg } from "@/components/icons/q";
import { Avatar } from "@/components/ui/avatar";
import { popupVariants } from "@/components/ui/shared/popup";
import { useLogout } from "@/features/auth/hooks/use-logout";

interface ProfileMenuProps {
  name: string | undefined;
}

const iconStyle = { height: 20, width: 20 };

const profileLinks = [
  {
    href: "/profile",
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
    href: "/profile/ratings",
    icon: <QSvg style={iconStyle} />,
    label: l.RATINGS.NAME,
  },
  {
    href: "/profile/listened",
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
    href: "/profile/bookmarks",
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
    href: "/profile/account",
    icon: <GearIcon style={iconStyle} />,
    label: l.MISC.ACCOUNT,
  },
];

export function ProfileMenu({ name }: ProfileMenuProps) {
  const { isLoggingOut, logout } = useLogout();

  const popupClass = popupVariants({
    className:
      "max-h-92 w-56 max-w-(--available-width) overflow-y-auto text-neutral-300",
  });

  function onSignOutPress() {
    logout();
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Profilmenü öffnen"
        className="inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0"
      >
        <Avatar name={name} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end" className="z-50" sideOffset={14}>
          <Popover.Popup className={popupClass}>
            <nav aria-label="Profilmenü">
              {profileLinks.map(({ href, icon, label }) => (
                <Popover.Close
                  key={href}
                  nativeButton={false}
                  render={
                    <Link
                      className="flex items-center px-4 py-3 text-sm hover:bg-[#011528]"
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
                    className="flex w-full cursor-pointer px-4 py-3 text-sm hover:bg-[#011528]"
                    disabled={isLoggingOut}
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
