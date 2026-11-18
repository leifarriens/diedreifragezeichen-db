// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "./button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a native button by default", () => {
    render(<Button className="custom-class">Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.classList.contains("custom-class")).toBe(true);
  });

  it("renders Next.js Link when given an href", () => {
    render(<Button href="/archive">Archive</Button>);

    expect(
      screen.getByRole("link", { name: "Archive" }).getAttribute("href"),
    ).toBe("/archive");
  });

  it("renders a native anchor when requested", () => {
    render(
      <Button
        as="a"
        href="https://example.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        External
      </Button>,
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link.getAttribute("href")).toBe("https://example.com");
    expect(link.getAttribute("target")).toBe("_blank");
  });
});
