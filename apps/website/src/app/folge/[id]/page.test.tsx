import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { ArchivApiError } from "@ddfdb/client/archiv";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getFolgeByLegacyId,
  getFolgeWithCommunityRatingById,
} from "@/server/queries/folgen";

import FolgePage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/server/queries/folgen", () => ({
  getFolgeByLegacyId: vi.fn(),
  getFolgeWithCommunityRatingById: vi.fn(),
}));
vi.mock("@/server/archiv-api", () => ({
  archivApi: {},
  ArchivApiError,
}));
vi.mock("@/features/bookmarks/folgen-bookmark-button", () => ({
  FolgenBookmarkButtonForFolge: vi.fn(),
}));
vi.mock("@/features/listened/folgen-listened-button", () => ({
  FolgenListenedButtonForFolge: vi.fn(),
}));
vi.mock("@/features/ratings/components/folgen-user-rating", () => ({
  FolgenUserRating: vi.fn(),
}));

const getLegacyFolge = vi.mocked(getFolgeByLegacyId);
const getFolge = vi.mocked(getFolgeWithCommunityRatingById);

const folge: FolgeWithCommunityRating = {
  artwork: null,
  authors: [],
  collection: "serie",
  communityRating: null,
  cover: null,
  description: "An episode description",
  id: 1,
  number: 1,
  releaseDate: null,
  scriptAuthors: [],
  streaming: {},
  title: "Der Super-Papagei",
  totalDuration: null,
  voiceRoles: [],
  weblink: null,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe.each([
  ["page", FolgePage],
  ["metadata", generateMetadata],
] as const)("episode %s", (_name, load) => {
  it("uses the not-found boundary for a missing episode", async () => {
    getFolge.mockResolvedValue(null);

    await expect(
      load({ params: Promise.resolve({ id: "4655" }) }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    expect(getFolge).toHaveBeenCalledWith(4655);
  });

  it.each(["1abc", "1.2", "-1", "0", "9007199254740992", "1\n"])(
    "rejects invalid episode IDs: %s",
    async (id) => {
      await expect(
        load({ params: Promise.resolve({ id }) }),
      ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
      expect(getFolge).not.toHaveBeenCalled();
    },
  );

  it("does not treat an unresolved legacy ID as a numeric ID", async () => {
    getLegacyFolge.mockResolvedValue(null);

    await expect(
      load({ params: Promise.resolve({ id: "1ab393fb75b7d99a1542ec28" }) }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    expect(getLegacyFolge).toHaveBeenCalledWith("1ab393fb75b7d99a1542ec28");
    expect(getFolge).not.toHaveBeenCalled();
  });

  it("permanently redirects leading-zero IDs to their normalized path", async () => {
    await expect(
      load({ params: Promise.resolve({ id: "0001" }) }),
    ).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;/folge/1;308;",
    });
    expect(getFolge).not.toHaveBeenCalled();
  });

  it.each([
    new ArchivApiError("Archive unavailable", "http", 503),
    new ArchivApiError("Network failure", "network"),
    new Error("Unexpected failure"),
  ])("preserves other errors: %s", async (error) => {
    getFolge.mockRejectedValue(error);

    await expect(load({ params: Promise.resolve({ id: "1" }) })).rejects.toBe(
      error,
    );
  });
});

it.each([
  ["page", FolgePage],
  ["metadata", generateMetadata],
] as const)(
  "resolves legacy IDs before numeric IDs for %s",
  async (_name, load) => {
    getLegacyFolge.mockResolvedValue(folge);

    await expect(
      load({ params: Promise.resolve({ id: "6ab393fb75b7d99a1542ec28" }) }),
    ).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;/folge/1;308;",
    });
    expect(getLegacyFolge).toHaveBeenCalledWith("6ab393fb75b7d99a1542ec28");
    expect(getFolge).not.toHaveBeenCalled();
  },
);

it("builds canonical URLs from the resolved episode", async () => {
  getFolge.mockResolvedValue({ ...folge, id: 42 });

  await expect(
    generateMetadata({ params: Promise.resolve({ id: "1" }) }),
  ).resolves.toMatchObject({
    alternates: { canonical: "https://www.ddfdb.de/folge/42" },
    openGraph: { url: "https://www.ddfdb.de/folge/42" },
  });
});

it("renders an existing episode and generates its metadata", async () => {
  getFolge.mockResolvedValue(folge);
  const params = Promise.resolve({ id: "1" });

  await expect(FolgePage({ params })).resolves.toMatchObject({
    props: { folge },
  });
  await expect(generateMetadata({ params })).resolves.toMatchObject({
    alternates: { canonical: "https://www.ddfdb.de/folge/1" },
    description: "An episode description",
    openGraph: { url: "https://www.ddfdb.de/folge/1" },
    title: "Folge 1 Der Super-Papagei",
  });
});
