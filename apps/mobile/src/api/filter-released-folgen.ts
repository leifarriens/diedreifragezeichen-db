import { isReleasDateInThePast } from "@ddfdb/core";

import type { Folge } from "./types";

export function filterReleasedFolgen(folgen: readonly Folge[]): Folge[] {
  return folgen.filter(
    (folge) =>
      folge.release_date === null || isReleasDateInThePast(folge.release_date),
  );
}
