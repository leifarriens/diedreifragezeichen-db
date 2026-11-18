import { DarkTheme, DefaultTheme } from "expo-router";

export const DdfColors = {
  dark: {
    accent: "#F2C84B",
    border: "#294155",
    notification: "#E47468",
    onAccent: "#172B3A",
    page: "#081522",
    primary: "009ee1",
    secondaryText: "#AAB7C2",
    surface: "#10263A",
    text: "#F4EBD4",
  },
  light: {
    accent: "#8B6208",
    border: "#D8CEB7",
    notification: "#A63F36",
    onAccent: "#FFFDF7",
    page: "#F4F0E6",
    primary: "009ee1",
    secondaryText: "#5D6C76",
    surface: "#FFFDF7",
    text: "#ffffff",
  },
} as const;

export const DdfDefaultTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: DdfColors.light.page,
    border: DdfColors.light.border,
    card: DdfColors.light.surface,
    notification: DdfColors.light.notification,
    primary: DdfColors.light.accent,
    text: DdfColors.light.text,
  },
};

export const DdfDarkTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DdfColors.dark.page,
    border: DdfColors.dark.border,
    card: DdfColors.dark.surface,
    notification: DdfColors.dark.notification,
    primary: DdfColors.dark.accent,
    text: DdfColors.dark.text,
  },
};
