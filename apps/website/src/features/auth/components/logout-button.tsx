"use client";

import { Button } from "@/components/ui/button/button";

import { useLogout } from "../hooks/use-logout";

export function LogoutButton() {
  const { isLoggingOut, logout } = useLogout();

  return (
    <Button isLoading={isLoggingOut} onClick={logout} type="button">
      Abmelden
    </Button>
  );
}
