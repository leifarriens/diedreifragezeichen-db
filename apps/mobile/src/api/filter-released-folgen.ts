import type { Folge } from "./types";

import dayjs from "../lib/date";

export function filterReleasedFolgen(folgen: readonly Folge[]): Folge[] {
  const today = dayjs();

  return folgen.filter(
    (folge) =>
      folge.release_date === null ||
      !dayjs(folge.release_date).isAfter(today, "day"),
  );
}
