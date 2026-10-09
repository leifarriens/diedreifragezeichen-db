import type { ListenedFolge } from "@ddfdb/user-api";

import { beforeEach, expect, it, vi } from "vitest";

import { PlayedFolgenProgress } from "./played-folgen-progress";

const state = vi.hoisted(() => ({
  isAuthenticated: true,
  listened: undefined as ListenedFolge[] | undefined,
  total: undefined as number | undefined,
}));

vi.mock("expo-router", () => ({
  useTheme: () => ({ colors: { card: "black", text: "white" } }),
}));
vi.mock("react-native", () => ({ Text: "Text", View: "View" }));
vi.mock("@/api/use-folgen", () => ({
  useFolgenTotal: () => ({ data: state.total }),
}));
vi.mock("@/components/played-folgen-progress-bar", () => ({
  PlayedFolgenProgressBar: "ProgressBar",
}));
vi.mock("@/features/listened/use-listened", () => ({
  useUserListened: () => ({ data: state.listened }),
}));
vi.mock("@/lib/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: state.isAuthenticated }),
}));

beforeEach(() => {
  state.isAuthenticated = true;
  state.listened = [{ createdAt: "2025-01-01", folgeId: 1 }];
  state.total = 2;
});

it("uses API-listened history to calculate progress", () => {
  expect(PlayedFolgenProgress()).toMatchObject({
    props: {
      children: [
        expect.anything(),
        { props: { progress: 0.5 }, type: "ProgressBar" },
        expect.anything(),
      ],
    },
  });
});

it("does not show a zero count before the user query resolves", () => {
  state.listened = undefined;
  expect(PlayedFolgenProgress()).toBeNull();
});

it("hides private progress for signed-out users", () => {
  state.isAuthenticated = false;
  expect(PlayedFolgenProgress()).toBeNull();
});

it("handles an empty archive without dividing by zero", () => {
  state.total = 0;
  expect(PlayedFolgenProgress()).toMatchObject({
    props: {
      children: [
        expect.anything(),
        { props: { progress: 0 }, type: "ProgressBar" },
        expect.anything(),
      ],
    },
  });
});
