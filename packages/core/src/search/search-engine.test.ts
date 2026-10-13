import { describe, expect, it } from "vitest";

import { createSearchEngine } from "./index";

function createTestFolge(overrides = {}) {
  return {
    authors: [],
    collection: "serie",
    communityRating: null,
    description: null,
    id: 1,
    number: null,
    release_date: null,
    script_authors: [],
    title: "Test episode",
    voice_roles: [],
    ...overrides,
  };
}

describe("createSearchEngine", () => {
  it("matches roles as complete values instead of individual words", async () => {
    const searchEngine = await createSearchEngine([
      createTestFolge({
        title: "Target episode",
        voice_roles: [{ role: "The Guy", speaker: "Speaker One" }],
      }),
      createTestFolge({
        id: 2,
        title: "False positive episode",
        voice_roles: [{ role: "The Villain", speaker: "Speaker Two" }],
      }),
    ]);

    const result = await searchEngine.search({
      filters: {
        authors: [],
        collections: [],
        roles: ["The Guy"],
        script_authors: [],
        speakers: [],
      },
      sort: { by: "release_date", order: "DESC" },
      term: "episode",
    });

    expect(result.results.map(({ title }) => title)).toEqual([
      "Target episode",
    ]);
  });

  it("returns matching Folgen with null and zero metadata unchanged", async () => {
    const searchEngine = await createSearchEngine([
      createTestFolge({ title: "Missing metadata episode" }),
      createTestFolge({
        description: "A description",
        id: 2,
        number: 0,
        release_date: "2000-01-01",
        title: "Zero metadata episode",
      }),
    ]);
    const filters = {
      authors: [],
      collections: [],
      roles: [],
      script_authors: [],
      speakers: [],
    };
    const sort = { by: "release_date", order: "DESC" } as const;

    const missingMetadata = await searchEngine.search({
      filters,
      sort,
      term: "Missing metadata",
    });
    expect(
      missingMetadata.results.find(
        (folge) => folge.title === "Missing metadata episode",
      ),
    ).toEqual({
      authors: [],
      collection: "serie",
      communityRating: null,
      description: null,
      id: 1,
      number: null,
      release_date: null,
      script_authors: [],
      title: "Missing metadata episode",
      voice_roles: [],
    });

    const zeroMetadata = await searchEngine.search({
      filters,
      sort,
      term: "Zero metadata",
    });
    expect(
      zeroMetadata.results.find(
        (folge) => folge.title === "Zero metadata episode",
      ),
    ).toEqual({
      authors: [],
      collection: "serie",
      communityRating: null,
      description: "A description",
      id: 2,
      number: 0,
      release_date: "2000-01-01",
      script_authors: [],
      title: "Zero metadata episode",
      voice_roles: [],
    });
  });
});
