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
  it.each(["mond", "uerm", "feuer", "Feuermond", "MOND", "d"])(
    "matches the title substring %s",
    async (term) => {
      const searchEngine = await createSearchEngine([
        createTestFolge({ title: "Feuermond" }),
        createTestFolge({ id: 2, title: "Nacht" }),
      ]);

      const result = await searchEngine.search({ term });

      expect(result.results.map(({ title }) => title)).toEqual(["Feuermond"]);
    },
  );

  it.each(["räts", "RÄTS", "rats"])(
    "normalizes the title substring %s",
    async (term) => {
      const searchEngine = await createSearchEngine([
        createTestFolge({ title: "Das Geheimrätsel" }),
        createTestFolge({ id: 2, title: "Der rote Mond" }),
      ]);

      const result = await searchEngine.search({ term });

      expect(result.results.map(({ title }) => title)).toEqual([
        "Das Geheimrätsel",
      ]);
    },
  );

  it.each(["mond nacht", "e mond"])(
    "preserves any-word matching for multiple title substrings in %s",
    async (term) => {
      const searchEngine = await createSearchEngine([
        createTestFolge({ title: "Feuermond in der Nacht" }),
        createTestFolge({ id: 2, title: "Die Nacht" }),
        createTestFolge({ id: 3, title: "Mond" }),
        createTestFolge({ id: 4, title: "Spuk" }),
      ]);

      const result = await searchEngine.search({ term });

      expect(result.results.map(({ title }) => title).sort()).toEqual([
        "Die Nacht",
        "Feuermond in der Nacht",
        "Mond",
      ]);
      expect(result.count).toBe(3);
    },
  );

  it("applies filters, sorting, and limits to substring matches", async () => {
    const folgen = [
      createTestFolge({ release_date: "2000-01-01", title: "Feuermond" }),
      createTestFolge({
        id: 2,
        release_date: "2001-01-01",
        title: "Mondnacht",
      }),
      createTestFolge({
        collection: "special",
        id: 3,
        release_date: "2002-01-01",
        title: "Vollmond",
      }),
    ];
    const searchEngine = await createSearchEngine(folgen);

    const result = await searchEngine.search({
      filters: { collections: ["serie"], yearRange: { max: 2002, min: 2000 } },
      limit: 1,
      sort: { by: "release_date", order: "DESC" },
      term: "mond",
    });

    expect(result).toEqual({ count: 1, results: [folgen[1]] });
  });

  it("preserves prefix-only matching for numbers and release dates", async () => {
    const folge = createTestFolge({
      number: 123,
      release_date: "2001-12-31",
      title: "Feuermond",
    });
    const searchEngine = await createSearchEngine([folge]);

    for (const term of ["12", "2001"]) {
      expect((await searchEngine.search({ term })).results).toEqual([folge]);
    }
    for (const term of ["23", "001"]) {
      expect((await searchEngine.search({ term })).results).toEqual([]);
    }
    expect((await searchEngine.search({ term: "" })).results).toEqual([folge]);
  });

  it("matches German umlauts without unrelated titles", async () => {
    const searchEngine = await createSearchEngine([
      createTestFolge({ title: "Das Rätsel der Nacht" }),
      createTestFolge({ id: 2, title: "Der rote Mond" }),
    ]);

    const result = await searchEngine.search({ term: "Rätsel" });

    expect(result.results.map(({ title }) => title)).toEqual([
      "Das Rätsel der Nacht",
    ]);
  });

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
