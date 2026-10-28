// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Kbd } from "./kbd";

afterEach(cleanup);

describe("Kbd", () => {
  it("renders its content with the semantic keyboard element", () => {
    const { container } = render(<Kbd>Alt</Kbd>);

    expect(screen.getByText("Alt").tagName).toBe("KBD");
    expect(container.querySelector("kbd")?.textContent).toBe("Alt");
  });
});
