// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SortSelector } from "./sort-selector";

const options = [
  { label: "Neueste", value: "newest" },
  { label: "Älteste", value: "oldest" },
  { label: "Beste", value: "rating" },
] as const;

afterEach(cleanup);

describe("SortSelector", () => {
  it("renders a labeled group with a single pressed option and custom classes", () => {
    render(
      <SortSelector
        aria-label="Sortierung"
        className="custom-class"
        onValueChange={vi.fn()}
        options={options}
        value="newest"
      />,
    );

    expect(
      screen
        .getByRole("group", { name: "Sortierung" })
        .classList.contains("custom-class"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Neueste", pressed: true }),
    ).toHaveProperty("type", "button");
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(2);
  });

  it("emits the typed value and updates the selected option", () => {
    const onValueChange = vi.fn();
    function Example() {
      const [value, setValue] = useState<"newest" | "oldest" | "rating">(
        "newest",
      );
      return (
        <SortSelector
          aria-label="Sortierung"
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
          options={options}
          value={value}
        />
      );
    }
    render(<Example />);

    fireEvent.click(screen.getByRole("button", { name: "Älteste" }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("oldest");
    expect(
      screen.getByRole("button", { name: "Älteste", pressed: true }),
    ).toBeDefined();
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Beste" }));
    expect(onValueChange).toHaveBeenLastCalledWith("rating");
    expect(
      screen.getByRole("button", { name: "Beste", pressed: true }),
    ).toBeDefined();
  });

  it("does not clear the selection when the pressed option is clicked", () => {
    const onValueChange = vi.fn();
    render(
      <SortSelector
        aria-label="Sortierung"
        onValueChange={onValueChange}
        options={options}
        value="newest"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Neueste" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Neueste", pressed: true }),
    ).toBeDefined();
  });

  it("reflects controlled value changes without emitting changes", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SortSelector
        aria-label="Sortierung"
        onValueChange={onValueChange}
        options={options}
        value="newest"
      />,
    );
    rerender(
      <SortSelector
        aria-label="Sortierung"
        onValueChange={onValueChange}
        options={options}
        value="rating"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Beste", pressed: true }),
    ).toBeDefined();
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports arrow-key focus navigation and wraps without changing the selection", async () => {
    const onValueChange = vi.fn();
    render(
      <SortSelector
        aria-label="Sortierung"
        onValueChange={onValueChange}
        options={options}
        value="newest"
      />,
    );
    const newest = screen.getByRole("button", { name: "Neueste" });
    const oldest = screen.getByRole("button", { name: "Älteste" });
    const best = screen.getByRole("button", { name: "Beste" });

    act(() => {
      newest.focus();
    });
    fireEvent.keyDown(newest, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(oldest);
    });
    fireEvent.keyDown(oldest, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(best);
    });
    fireEvent.keyDown(best, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(newest);
    });
    fireEvent.keyDown(newest, { key: "ArrowLeft" });
    await waitFor(() => {
      expect(document.activeElement).toBe(best);
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ignores interaction when disabled", () => {
    const onValueChange = vi.fn();
    render(
      <SortSelector
        aria-label="Sortierung"
        disabled
        onValueChange={onValueChange}
        options={options}
        value="newest"
      />,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveProperty("disabled", true);
      fireEvent.click(button);
    }
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports disabled options and skips them during keyboard navigation", async () => {
    const onValueChange = vi.fn();
    render(
      <SortSelector
        aria-label="Sortierung"
        onValueChange={onValueChange}
        options={options.map((option) => ({
          ...option,
          disabled: option.value === "oldest",
        }))}
        value="newest"
      />,
    );

    const oldest = screen.getByRole("button", { name: "Älteste" });
    expect(oldest).toHaveProperty("disabled", true);
    fireEvent.click(oldest);
    expect(onValueChange).not.toHaveBeenCalled();
    const newest = screen.getByRole("button", { name: "Neueste" });
    act(() => {
      newest.focus();
    });
    fireEvent.keyDown(newest, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Beste" }),
      );
    });
  });
});
