import { describe, expect, it } from "vitest";

import { sortFolgenByAddedAt } from "./sort";

describe("sortFolgenByAddedAt", () => {
  it("sorts newest or oldest additions first without mutating the input", () => {
    const folgen = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const addedAtById = new Map([
      ["1", 100],
      ["2", 300],
      ["3", 200],
    ]);

    expect(
      sortFolgenByAddedAt(folgen, addedAtById, -1).map(({ id }) => id),
    ).toEqual([2, 3, 1]);
    expect(
      sortFolgenByAddedAt(folgen, addedAtById, 1).map(({ id }) => id),
    ).toEqual([1, 3, 2]);
    expect(folgen.map(({ id }) => id)).toEqual([1, 2, 3]);
  });

  it("keeps equal timestamps stable and places missing timestamps last", () => {
    const folgen = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const addedAtById = new Map([
      ["1", 100],
      ["2", 100],
      ["3", 200],
    ]);

    expect(
      sortFolgenByAddedAt(folgen, addedAtById, -1).map(({ id }) => id),
    ).toEqual([3, 1, 2, 4]);
    expect(
      sortFolgenByAddedAt(folgen, addedAtById, 1).map(({ id }) => id),
    ).toEqual([1, 2, 3, 4]);
  });
});
