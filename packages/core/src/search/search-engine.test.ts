import { describe, expect, it } from "vitest";

import { createSearchEngine } from "./index";

describe("createSearchEngine", () => {
  it("returns matching Folgen with null and zero metadata unchanged", async () => {
    const searchEngine = await createSearchEngine([
      {
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
      },
      {
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
      },
    ]);
    const filters = {
      authors: [],
      collections: [],
      roles: [],
      script_authors: [],
      speakers: [],
    };
    const sort = { by: "release_date", order: "DESC" } as const;

    const missingMetadata = await searchEngine.searchDb({
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

    const zeroMetadata = await searchEngine.searchDb({
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
