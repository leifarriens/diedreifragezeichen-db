// @vitest-environment jsdom

import { l } from "@ddfdb/core/labels";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FolgenListenedButton } from "../listened/folgen-listened-button";
import { FolgenBookmarkButton } from "./folgen-bookmark-button";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/ui/toast/toast", () => ({
  useToast: () => ({ add: vi.fn() }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: true, isPending: false }),
}));

vi.mock("./use-bookmarks", () => ({
  useUpdateFolgenBookmark: () => ({
    addBookmarkMutation: { mutate: vi.fn() },
    isLoading: false,
    removeBookmarkMutation: { mutate: vi.fn() },
  }),
}));

vi.mock("../listened/use-listened", () => ({
  useUpdateFolgenListenStatus: () => ({
    isLoading: false,
    markFolgeAsListenedMutation: { mutate: vi.fn() },
    markFolgeAsNotListenedMutation: { mutate: vi.fn() },
  }),
}));

afterEach(cleanup);

describe("Folge action button titles", () => {
  it("updates the bookmark title and accessible label with its state", () => {
    const { rerender } = render(
      <FolgenBookmarkButton
        folgeId={1}
        folgeTitle="Die drei Fragezeichen"
        isBookmarked={false}
      />,
    );

    const button = screen.getByRole("button", {
      name: `${l.ACTIONS.ADD_BOOKMARK}: Die drei Fragezeichen`,
    });
    expect(button.getAttribute("title")).toBe(l.ACTIONS.ADD_BOOKMARK);
    expect(button.getAttribute("aria-pressed")).toBe("false");

    rerender(
      <FolgenBookmarkButton
        folgeId={1}
        folgeTitle="Die drei Fragezeichen"
        isBookmarked
      />,
    );

    const pressedButton = screen.getByRole("button", {
      name: `${l.ACTIONS.REMOVE_BOOKMARK}: Die drei Fragezeichen`,
    });
    expect(pressedButton.getAttribute("title")).toBe(l.ACTIONS.REMOVE_BOOKMARK);
    expect(pressedButton.getAttribute("aria-pressed")).toBe("true");
  });

  it("updates the listened title and accessible label with its state", () => {
    const { rerender } = render(
      <FolgenListenedButton
        folgeId={1}
        folgeTitle="Die drei Fragezeichen"
        hasListened={false}
      />,
    );

    const button = screen.getByRole("button", {
      name: `${l.ACTIONS.MARK_LISTENED}: Die drei Fragezeichen`,
    });
    expect(button.getAttribute("title")).toBe(l.ACTIONS.MARK_LISTENED);
    expect(button.getAttribute("aria-pressed")).toBe("false");

    rerender(
      <FolgenListenedButton
        folgeId={1}
        folgeTitle="Die drei Fragezeichen"
        hasListened
      />,
    );

    const pressedButton = screen.getByRole("button", {
      name: `${l.ACTIONS.MARK_UNLISTENED}: Die drei Fragezeichen`,
    });
    expect(pressedButton.getAttribute("title")).toBe(l.ACTIONS.MARK_UNLISTENED);
    expect(pressedButton.getAttribute("aria-pressed")).toBe("true");
  });
});
