// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Combobox, type ComboboxItem } from "./combobox";

afterEach(() => {
  cleanup();
});

describe("Combobox", () => {
  it("filters available items as the user types", async () => {
    const items: ComboboxItem<string>[] = [
      { label: "Dorette Hugo", value: "Dorette Hugo" },
      { label: "André Marx", value: "André Marx" },
    ];

    render(
      <Combobox
        items={items}
        label="Sprechrollen"
        multiple
        placeholder="z.B. Dorette Hugo"
      />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.input(input, {
      inputType: "insertText",
      target: { value: "Dorette" },
    });

    expect(
      await screen.findByRole("option", { name: "Dorette Hugo" }),
    ).toBeTruthy();
    expect(screen.queryByRole("option", { name: "André Marx" })).toBeNull();
  });
});
