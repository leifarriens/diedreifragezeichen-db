import type { NativeStackHeaderItem } from "expo-router";

import { useMemo } from "react";

import { useUserSettingsStore } from "@/features/settings/hooks/use-user-settings-store";

export function useViewMode() {
  const viewMode =
    useUserSettingsStore((state) => state.folgenListViewMode) ?? "grid";
  const setViewMode = useUserSettingsStore(
    (state) => state.setFolgenListViewMode,
  );

  const viewModeMenu = useMemo<NativeStackHeaderItem[]>(() => {
    const iconName = viewMode === "grid" ? "square.grid.2x2" : "list.bullet";

    return [
      {
        icon: {
          name: iconName,
          type: "sfSymbol",
        },
        label: "Ansicht",
        menu: {
          items: [
            {
              icon: {
                name: "square.grid.2x2",
                type: "sfSymbol",
              },
              label: "Gitter",
              onPress() {
                setViewMode("grid");
              },
              state: viewMode === "grid" ? ("on" as const) : ("off" as const),
              type: "action" as const,
            },
            {
              icon: {
                name: "list.bullet",
                type: "sfSymbol",
              },
              label: "Liste",
              onPress() {
                setViewMode("list");
              },
              state: viewMode === "list" ? ("on" as const) : ("off" as const),
              type: "action" as const,
            },
          ],
        },
        type: "menu",
      },
    ];
  }, [viewMode, setViewMode]);

  return { viewMode, viewModeMenu };
}
