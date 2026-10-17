// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Input } from "./input";

afterEach(cleanup);

describe("Input", () => {
  it("renders an input and forwards its change event", () => {
    const onChange = vi.fn();
    render(<Input label="Folgen suchen" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Folgen suchen" });
    fireEvent.change(input, { target: { value: "Die drei ???" } });

    expect(onChange).toHaveBeenCalledOnce();
  });
});
