// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingIndicator } from "./loading-indicator";
import styles from "./loading-indicator.module.css";

afterEach(cleanup);

describe("LoadingIndicator", () => {
  it.each(["???", "spinner"] as const)(
    "animates HTML wrappers instead of SVGs for %s",
    (type) => {
      render(<LoadingIndicator ariaLabel="Loading" type={type} />);

      const status = screen.getByRole("status", { name: "Loading" });
      const icons = status.querySelectorAll("svg");
      const animationClass = type === "spinner" ? "animate-spin" : styles.icon;

      expect(status.getAttribute("aria-busy")).toBe("true");
      expect(icons).toHaveLength(type === "spinner" ? 1 : 3);
      expect(status.textContent).toContain("Laden...");

      for (const icon of icons) {
        const wrapper = icon.parentElement;

        expect(animationClass).toBeTypeOf("string");
        expect(icon.classList).not.toContain(animationClass);
        expect(wrapper?.tagName).toBe("DIV");
        expect(wrapper?.classList).toContain(animationClass);
        expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
      }
    },
  );
});
