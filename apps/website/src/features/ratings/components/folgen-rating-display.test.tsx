// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FolgenRatingDisplay } from "./folgen-rating-display";

afterEach(cleanup);

describe("FolgenRatingDisplay", () => {
  it("exposes community and user ratings as labeled images", () => {
    render(
      <>
        <FolgenRatingDisplay
          folgenTitle="Meister des Lichts"
          type="community"
          value={null}
        />
        <FolgenRatingDisplay
          folgenTitle="Meister des Lichts"
          type="user"
          value={null}
        />
      </>,
    );

    expect(
      screen.getByRole("img", {
        name: "Meister des Lichts hat noch keine Bewertung",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: "Du hast Meister des Lichts noch nicht bewertet",
      }),
    ).toBeTruthy();
  });
});
