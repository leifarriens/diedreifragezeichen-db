// @vitest-environment jsdom

import type { ComponentProps } from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/features/auth/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: true, isPending: false }),
}));

import { FolgenRatingInput as FolgenRatingInputComponent } from "./folgen-rating-input";

function FolgenRatingInput(
  props: Omit<ComponentProps<typeof FolgenRatingInputComponent>, "folgenTitle">,
) {
  return <FolgenRatingInputComponent folgenTitle="Testfolge" {...props} />;
}

afterEach(cleanup);

function getPreviewOverlay() {
  const overlay = screen.getByRole("slider").nextElementSibling;
  if (!overlay) {
    throw new Error("Rating preview overlay not found");
  }
  return overlay;
}

describe("FolgenRatingInput", () => {
  it("reflects fetched ratings and cleared ratings without emitting changes", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FolgenRatingInput onValueChange={onValueChange} value={null} />,
    );
    expect(screen.getByRole("slider")).toHaveProperty("value", "0");

    rerender(<FolgenRatingInput onValueChange={onValueChange} value={2.5} />);
    expect(screen.getByRole("slider")).toHaveProperty("value", "2.5");

    rerender(<FolgenRatingInput onValueChange={onValueChange} value={1} />);
    expect(screen.getByRole("slider")).toHaveProperty("value", "1");

    rerender(<FolgenRatingInput onValueChange={onValueChange} value={null} />);
    expect(screen.getByRole("slider")).toHaveProperty("value", "0");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps a preview during updates and restores the latest rating on mouse-out", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FolgenRatingInput onValueChange={onValueChange} value={1} />,
    );
    const overlay = getPreviewOverlay();
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 300, 64),
    );

    fireEvent.mouseMove(overlay, { clientX: 175 });
    expect(screen.getByRole("slider")).toHaveProperty("value", "2");

    rerender(<FolgenRatingInput onValueChange={onValueChange} value={2.5} />);
    expect(screen.getByRole("slider")).toHaveProperty("value", "2");

    fireEvent.click(overlay);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(2);

    fireEvent.mouseOut(overlay);
    expect(screen.getByRole("slider")).toHaveProperty("value", "2.5");
  });

  it("preserves a zero preview and submits range input changes", () => {
    const onValueChange = vi.fn();
    render(<FolgenRatingInput onValueChange={onValueChange} value={3} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    expect(screen.getByRole("slider")).toHaveProperty("value", "0");

    fireEvent.click(getPreviewOverlay());
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(0);

    fireEvent.mouseOut(getPreviewOverlay());
    expect(screen.getByRole("slider")).toHaveProperty("value", "3");
  });

  it("keeps the displayed rating when hover geometry is unavailable", () => {
    render(<FolgenRatingInput onValueChange={vi.fn()} value={2.5} />);
    fireEvent.mouseMove(getPreviewOverlay(), { clientX: 100 });
    expect(screen.getByRole("slider")).toHaveProperty("value", "2.5");
  });
});
