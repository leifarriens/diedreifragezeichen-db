import type { NativeStackHeaderItem } from "expo-router";

import type { FolgenListViewMode } from "./types";

export const folgenListViewMenu = ({
  setViewMode,
  viewMode,
}: {
  setViewMode: (viewMode: FolgenListViewMode) => void;
  viewMode: FolgenListViewMode;
}): NativeStackHeaderItem[] => {
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
};
