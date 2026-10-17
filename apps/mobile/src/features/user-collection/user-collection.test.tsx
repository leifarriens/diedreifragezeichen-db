import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { enrichFolgenWithUserData } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  hookIndex: 0,
  searchTerm: "",
  sortValue: undefined as string | undefined,
  useSearch: vi.fn(
    (folgen: FolgeWithCommunityRating[], { term }: { term: string }) => ({
      data: term
        ? { results: folgen.filter((folge) => folge.title.includes(term)) }
        : undefined,
    }),
  ),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useMemo: <T,>(callback: () => T) => callback(),
    useState: <T,>(initialValue: T): [T, (value: T) => void] => {
      const hookIndex = state.hookIndex++;

      if (hookIndex === 0) {
        return [
          state.searchTerm as T,
          (value) => {
            state.searchTerm = value as string;
          },
        ];
      }

      return [
        (state.sortValue ?? initialValue) as T,
        (value) => {
          state.sortValue = value as string;
        },
      ];
    },
  };
});

vi.mock("@ddfdb/client", () => ({ useSearch: state.useSearch }));
vi.mock("expo-router", () => ({ Stack: { Screen: "StackScreen" } }));
vi.mock("@/api/use-hydrate-folgen-with-user-data", () => ({
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
vi.mock("@/features/folgen-list/folgen-list", () => ({
  FolgenList: "FolgenList",
}));

import { UserCollection } from "./user-collection";

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

const sortOptions = [
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
] as const;

const props = {
  detailPathname: "/(tabs)/gespeichert/[folgeId]",
  emptyMessage: l.BOOKMARKS.EMPTY_PLACEHOLDER,
  folgen,
  initialSortValue: "newest",
  isInitialLoading: false,
  isRefreshing: false,
  onRequestRefresh: vi.fn(),
  searchPlaceholder: l.BOOKMARKS.SEARCH_PLACEHOLDER,
  sortLabel: l.BOOKMARKS.SORTING.LABEL,
  sortOptions,
  title: l.BOOKMARKS.NAME,
} as const;

interface CollectionTree {
  props: {
    children: [
      { props: { options: Record<string, unknown> } },
      { props: { folgen: FolgeWithCommunityRating[] } },
    ];
  };
}

function renderCollection() {
  state.hookIndex = 0;
  return UserCollection(props) as unknown as CollectionTree;
}

beforeEach(() => {
  state.hookIndex = 0;
  state.searchTerm = "";
  state.sortValue = undefined;
  vi.clearAllMocks();
});

describe("UserCollection", () => {
  it("sorts with the initial choice and exposes the native screen labels", () => {
    const tree = renderCollection();
    const [screen, list] = tree.props.children;
    const options = screen.props.options as {
      headerSearchBarOptions: { placeholder: string };
      title: string;
      unstable_headerRightItems: () => {
        menu: {
          items: {
            label: string;
            onPress: () => void;
            state: string;
            type: string;
          }[];
        };
      }[];
    };

    expect(options.title).toBe(l.BOOKMARKS.NAME);
    expect(options.headerSearchBarOptions.placeholder).toBe(
      l.BOOKMARKS.SEARCH_PLACEHOLDER,
    );
    expect(
      options
        .unstable_headerRightItems()[0]
        ?.menu.items.map(({ label, onPress, state, type }) => ({
          hasOnPress: typeof onPress === "function",
          label,
          state,
          type,
        })),
    ).toEqual([
      {
        hasOnPress: true,
        label: l.BOOKMARKS.SORTING.NEWEST_FIRST,
        state: "on",
        type: "action",
      },
      {
        hasOnPress: true,
        label: l.BOOKMARKS.SORTING.OLDEST_FIRST,
        state: "off",
        type: "action",
      },
    ]);
    expect(list.props.folgen.map(({ id }) => id)).toEqual([1, 3, 2]);
  });

  it("applies native search and sorting selections to the displayed Folgen", () => {
    const initial = renderCollection();
    const screen = initial.props.children[0];
    const options = screen.props.options as {
      headerSearchBarOptions: {
        onChangeText: (event: { nativeEvent: { text: string } }) => void;
      };
      unstable_headerRightItems: () => {
        menu: { items: { onPress: () => void }[] };
      }[];
    };

    options.unstable_headerRightItems()[0]?.menu.items[1]?.onPress();

    const sorted = renderCollection();
    expect(sorted.props.children[1].props.folgen.map(({ id }) => id)).toEqual([
      2, 3, 1,
    ]);

    const sortedOptions = sorted.props.children[0].props.options as {
      headerSearchBarOptions: {
        onChangeText: (event: { nativeEvent: { text: string } }) => void;
      };
    };
    sortedOptions.headerSearchBarOptions.onChangeText({
      nativeEvent: { text: "Folge 1" },
    });

    const filtered = renderCollection();
    expect(state.useSearch).toHaveBeenLastCalledWith(folgen, {
      term: "Folge 1",
    });
    expect(filtered.props.children[1].props.folgen.map(({ id }) => id)).toEqual(
      [1],
    );
  });
});
