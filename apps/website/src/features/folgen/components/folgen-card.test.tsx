// @vitest-environment jsdom

import type { FolgenListItemWithUserData } from "@ddfdb/client";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FolgenCard } from "./folgen-card";

vi.mock("../hooks/use-intersection-observer", () => ({
  useIntersectionObserver: () => false,
}));
vi.mock("./folgen-cover", () => ({ FolgenCover: () => <div>Cover</div> }));
vi.mock("./folgen-artwork", () => ({
  FolgenBackground: ({
    artworkUrl,
    loading,
  }: {
    artworkUrl: string;
    loading: string;
  }) => (
    <div
      data-loading={loading}
      data-testid="background"
      data-url={artworkUrl}
    />
  ),
}));
vi.mock("@/features/ratings/components/folgen-rating-display", () => ({
  FolgenRatingDisplay: () => null,
}));

const folge: FolgenListItemWithUserData = {
  artwork: "https://example.com/artwork.jpg",
  authors: [],
  bookmarkedAt: null,
  collection: "serie",
  communityRating: null,
  cover: "https://example.com/cover.jpg",
  hasListened: false,
  id: 1,
  isBookmarked: false,
  listenedAt: null,
  number: 1,
  releaseDate: null,
  scriptAuthors: [],
  title: "Folge 1",
  totalDuration: null,
  userRating: null,
  userRatingUpdatedAt: null,
  voiceRoles: [],
};

class TestPointerEvent extends MouseEvent {
  readonly pointerType: string;

  constructor(type: string, init?: PointerEventInit) {
    super(type, init);
    this.pointerType = init?.pointerType ?? "";
  }
}

beforeEach(() => {
  vi.stubGlobal("PointerEvent", TestPointerEvent);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("FolgenCard background", () => {
  it("loads on mouse hover and remains mounted after leaving", () => {
    render(<FolgenCard coverLoading="lazy" folge={folge} />);
    const card = screen.getByRole("article");
    expect(screen.queryByTestId("background")).toBeNull();

    fireEvent.pointerOver(card, { pointerType: "mouse" });
    const background = screen.getByTestId("background");
    expect(background.getAttribute("data-url")).toBe(folge.artwork);
    expect(background.getAttribute("data-loading")).toBe("eager");

    fireEvent.pointerOut(card, { pointerType: "mouse" });
    expect(screen.getByTestId("background")).toBe(background);
  });

  it("does not load on touch pointer entry", () => {
    render(<FolgenCard coverLoading="lazy" folge={folge} />);
    fireEvent.pointerOver(screen.getByRole("article"), {
      pointerType: "touch",
    });
    expect(screen.queryByTestId("background")).toBeNull();
  });

  it("loads the cover as a fallback on keyboard focus", () => {
    render(
      <FolgenCard coverLoading="lazy" folge={{ ...folge, artwork: null }} />,
    );
    fireEvent.focusIn(screen.getByRole("link", { name: "Folge: Folge 1" }));
    const background = screen.getByTestId("background");
    expect(background.getAttribute("data-url")).toBe(folge.cover);
    expect(background.parentElement?.className).toContain(
      "group-focus-within:opacity-100",
    );
  });

  it("does not render a background image when no image is available", () => {
    render(
      <FolgenCard
        coverLoading="lazy"
        folge={{ ...folge, artwork: null, cover: null }}
      />,
    );
    fireEvent.pointerOver(screen.getByRole("article"), {
      pointerType: "mouse",
    });
    expect(screen.queryByTestId("background")).toBeNull();
  });
});
