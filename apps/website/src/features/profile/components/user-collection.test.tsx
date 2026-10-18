// @vitest-environment jsdom

import type { FolgeUserData, FolgeWithCommunityRating } from "@ddfdb/core";

import { enrichFolgenWithUserData } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { type CollectionSortChoice, UserCollection } from "./user-collection";

const { useSearch } = vi.hoisted(() => ({
  useSearch: vi.fn(
    (folgen: FolgeWithCommunityRating[], { term }: { term: string }) => ({
      data: term
        ? { results: folgen.filter((folge) => folge.title.includes(term)) }
        : undefined,
    }),
  ),
}));

vi.mock("@ddfdb/client", () => ({ useSearch }));

vi.mock("@/features/folgen/use-hydrate-folgen-with-user-data", () => ({
  useHydrateFolgenWithUserData: (folgen: FolgeWithCommunityRating[]) =>
    enrichFolgenWithUserData(folgen, {
      bookmarks: [
        { createdAt: "2025-01-03", folgeId: 1 },
        { createdAt: "2025-01-01", folgeId: 2 },
        { createdAt: "2025-01-02", folgeId: 3 },
      ],
      listened: [
        { createdAt: "2025-01-02", folgeId: 1 },
        { createdAt: "2025-01-03", folgeId: 2 },
        { createdAt: "2025-01-01", folgeId: 3 },
      ],
      ratings: [
        { folgeId: 1, score: 2, updatedAt: "2025-01-03" },
        { folgeId: 2, score: 1, updatedAt: "2025-01-02" },
        { folgeId: 3, score: 3, updatedAt: "2025-01-01" },
      ],
    }),
}));

vi.mock("@/features/folgen/components/folgen-grid", () => ({
  FolgenGrid: ({
    emptyMessage,
    folgen,
  }: {
    emptyMessage: { title: string | undefined };
    folgen: (FolgeUserData & FolgeWithCommunityRating)[];
  }) => (
    <div>
      <p data-testid="empty-title">{emptyMessage.title}</p>
      <ol>
        {folgen.map((folge) => (
          <li key={folge.id}>{folge.title}</li>
        ))}
      </ol>
    </div>
  ),
}));

const folgen: FolgeWithCommunityRating[] = [1, 2, 3].map((id) => ({
  artwork: null,
  authors: [],
  collection: "serie",
  communityRating: null,
  cover: null,
  description: null,
  id,
  number: id,
  release_date: null,
  script_authors: [],
  streaming: {},
  title: `Folge ${String(id)}`,
  total_duration: null,
  voice_roles: [],
  weblink: null,
}));

const ratingChoices = [
  {
    label: "Recent",
    sort: { by: "userRatingUpdatedAt", order: "newest" },
    value: "recent",
  },
  {
    label: "Highest",
    sort: { by: "userRating", order: "highest" },
    value: "highest",
  },
] as const satisfies readonly CollectionSortChoice[];

const bookmarkProps = {
  emptyMessage: l.BOOKMARKS.EMPTY_PLACEHOLDER,
  initialSortValue: "newest",
  searchPlaceholder: l.BOOKMARKS.SEARCH_PLACEHOLDER,
  sortLabel: l.BOOKMARKS.SORTING.LABEL,
  sortOptions: [
    {
      label: l.BOOKMARKS.SORTING.NEWEST_FIRST,
      sort: { by: "bookmarkedAt", order: "newest" },
      value: "newest",
    },
    {
      label: l.BOOKMARKS.SORTING.OLDEST_FIRST,
      sort: { by: "bookmarkedAt", order: "oldest" },
      value: "oldest",
    },
  ],
} as const;

const listenedProps = {
  emptyMessage: l.LISTENED.EMPTY_PLACEHOLDER,
  initialSortValue: "newest",
  searchPlaceholder: l.LISTENED.SEARCH_PLACEHOLDER,
  sortLabel: l.LISTENED.SORTING.LABEL,
  sortOptions: [
    {
      label: l.LISTENED.SORTING.NEWEST_FIRST,
      sort: { by: "listenedAt", order: "newest" },
      value: "newest",
    },
    {
      label: l.LISTENED.SORTING.OLDEST_FIRST,
      sort: { by: "listenedAt", order: "oldest" },
      value: "oldest",
    },
  ],
} as const;

const ratingProps = {
  emptyMessage: l.RATINGS.EMPTY_PLACEHOLDER,
  initialSortValue: "recent",
  searchPlaceholder: l.RATINGS.SEARCH_PLACEHOLDER,
  sortLabel: l.RATINGS.SORTING.LABEL,
  sortOptions: [
    { ...ratingChoices[0], label: l.RATINGS.SORTING.NEWEST_FIRST },
    { ...ratingChoices[1], label: l.RATINGS.SORTING.HIGHEST_RATED_FIRST },
    {
      label: l.RATINGS.SORTING.LOWEST_RATED_FIRST,
      sort: { by: "userRating", order: "lowest" },
      value: "lowest",
    },
  ],
} as const;

function displayedTitles() {
  return screen.queryAllByRole("listitem").map((item) => item.textContent);
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("UserCollection", () => {
  it("infers allowed initial values only from the choices", () => {
    type Props = Parameters<typeof UserCollection<typeof ratingChoices>>[0];
    expectTypeOf<Props["initialSortValue"]>().toEqualTypeOf<
      "highest" | "recent"
    >();

    const invalidSelection = (
      <UserCollection
        {...ratingProps}
        folgen={folgen}
        // @ts-expect-error The initial value must occur in the choices.
        initialSortValue="oldest"
        sortOptions={ratingChoices}
      />
    );
    expect(invalidSelection).toBeDefined();
  });

  it("preserves literal inference for inline choices", () => {
    const invalidSelection = (
      <UserCollection
        emptyMessage={bookmarkProps.emptyMessage}
        folgen={folgen}
        // @ts-expect-error Inline choices must not widen to accept this value.
        initialSortValue="unknown"
        searchPlaceholder={bookmarkProps.searchPlaceholder}
        sortLabel={bookmarkProps.sortLabel}
        sortOptions={[
          {
            label: "Newest",
            sort: { by: "bookmarkedAt", order: "newest" },
            value: "newest",
          },
        ]}
      />
    );
    expect(invalidSelection).toBeDefined();
  });

  it("uses a non-first initial choice without changing the default on rerender", () => {
    const { rerender } = render(
      <UserCollection
        {...ratingProps}
        folgen={folgen}
        initialSortValue="highest"
        sortOptions={ratingChoices}
      />,
    );
    expect(displayedTitles()).toEqual(["Folge 3", "Folge 1", "Folge 2"]);
    expect(
      screen.getByRole("button", { name: "Highest", pressed: true }),
    ).toBeDefined();

    rerender(
      <UserCollection
        {...ratingProps}
        folgen={folgen}
        initialSortValue="recent"
        sortOptions={ratingChoices}
      />,
    );
    expect(displayedTitles()).toEqual(["Folge 3", "Folge 1", "Folge 2"]);
  });

  it("sorts bookmarks by their bookmark dates", () => {
    render(<UserCollection {...bookmarkProps} folgen={folgen} />);
    expect(displayedTitles()).toEqual(["Folge 1", "Folge 3", "Folge 2"]);

    fireEvent.click(
      screen.getByRole("button", { name: l.BOOKMARKS.SORTING.OLDEST_FIRST }),
    );
    expect(displayedTitles()).toEqual(["Folge 2", "Folge 3", "Folge 1"]);
  });

  it("sorts listened Folgen by their listening dates and uses listened labels", () => {
    render(<UserCollection {...listenedProps} folgen={folgen} />);
    expect(
      screen.getByRole("group", { name: l.LISTENED.SORTING.LABEL }),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText(l.LISTENED.SEARCH_PLACEHOLDER),
    ).toBeDefined();
    expect(displayedTitles()).toEqual(["Folge 2", "Folge 1", "Folge 3"]);

    fireEvent.click(
      screen.getByRole("button", { name: l.LISTENED.SORTING.OLDEST_FIRST }),
    );
    expect(displayedTitles()).toEqual(["Folge 3", "Folge 1", "Folge 2"]);
  });

  it("switches between rating update dates and scores without collection-specific handlers", () => {
    render(<UserCollection {...ratingProps} folgen={folgen} />);
    expect(displayedTitles()).toEqual(["Folge 1", "Folge 2", "Folge 3"]);

    fireEvent.click(
      screen.getByRole("button", {
        name: l.RATINGS.SORTING.HIGHEST_RATED_FIRST,
      }),
    );
    expect(displayedTitles()).toEqual(["Folge 3", "Folge 1", "Folge 2"]);

    fireEvent.click(
      screen.getByRole("button", {
        name: l.RATINGS.SORTING.LOWEST_RATED_FIRST,
      }),
    );
    expect(displayedTitles()).toEqual(["Folge 2", "Folge 1", "Folge 3"]);

    fireEvent.click(
      screen.getByRole("button", { name: l.RATINGS.SORTING.NEWEST_FIRST }),
    );
    expect(
      screen.getByRole("button", {
        name: l.RATINGS.SORTING.NEWEST_FIRST,
        pressed: true,
      }),
    ).toBeDefined();
    expect(displayedTitles()).toEqual(["Folge 1", "Folge 2", "Folge 3"]);
  });

  it("searches the collection and preserves the selected sort", () => {
    render(<UserCollection {...bookmarkProps} folgen={folgen} />);
    fireEvent.click(
      screen.getByRole("button", { name: l.BOOKMARKS.SORTING.OLDEST_FIRST }),
    );

    const search = screen.getByPlaceholderText(l.BOOKMARKS.SEARCH_PLACEHOLDER);
    fireEvent.change(search, { target: { value: "Folge 1" } });
    expect(useSearch).toHaveBeenLastCalledWith(folgen, { term: "Folge 1" });
    expect(displayedTitles()).toEqual(["Folge 1"]);

    fireEvent.change(search, { target: { value: "missing" } });
    expect(displayedTitles()).toEqual([]);
    expect(screen.getByTestId("empty-title").textContent).toBe("");

    fireEvent.change(search, { target: { value: "" } });
    expect(displayedTitles()).toEqual(["Folge 2", "Folge 3", "Folge 1"]);
  });

  it("uses custom text without depending on a collection label key", () => {
    render(
      <UserCollection
        {...bookmarkProps}
        emptyMessage="Your collection is empty"
        folgen={[]}
        searchPlaceholder="Find an episode"
        sortLabel="Choose episode order"
      />,
    );

    expect(screen.getByTestId("empty-title").textContent).toBe(
      "Your collection is empty",
    );
    expect(screen.getByPlaceholderText("Find an episode")).toBeDefined();
    expect(
      screen.getByRole("group", { name: "Choose episode order" }),
    ).toBeDefined();
  });

  it.each(["BOOKMARKS", "LISTENED", "RATINGS"] as const)(
    "passes the %s empty label to the grid",
    (labelKey) => {
      render(
        <UserCollection
          {...bookmarkProps}
          emptyMessage={l[labelKey].EMPTY_PLACEHOLDER}
          folgen={[]}
        />,
      );
      expect(screen.getByTestId("empty-title").textContent).toBe(
        l[labelKey].EMPTY_PLACEHOLDER,
      );
    },
  );
});
