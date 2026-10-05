import { afterEach, describe, expect, it, vi } from "vitest";

import type { Folge } from "./types";

import { filterReleasedFolgen } from "./filter-released-folgen";

function episode(id: number, release_date: Folge["release_date"]): Folge {
  return {
    artwork: null,
    collection: "serie",
    cover: null,
    description: null,
    id,
    links: {},
    number: id,
    release_date,
    title: `Episode ${String(id)}`,
    total_duration: null,
    weblink: null,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("filterReleasedFolgen", () => {
  it("excludes future release dates and keeps today's, past, and undated Folgen", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 1, 10, 12));

    const folgen = [
      episode(1, "2025-02-09"),
      episode(2, "2025-02-10"),
      episode(3, "2025-02-11"),
      episode(4, null),
    ];

    expect(filterReleasedFolgen(folgen)).toEqual([
      folgen[0],
      folgen[1],
      folgen[3],
    ]);
  });
});
