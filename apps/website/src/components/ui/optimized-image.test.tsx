// @vitest-environment jsdom

import { buildOptimizationUrl } from "@ddfdb/image-optimization";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FolgenCover } from "../../features/folgen/components/folgen-cover";
import { OptimizedImage, type OptimizedImageProps } from "./optimized-image";

afterEach(cleanup);

const src = "https://cdn-p.smehost.net/cover.jpg";

describe("OptimizedImage", () => {
  it("falls back to the original source without reporting an error", async () => {
    const onError = vi.fn();
    const onLoad = vi.fn();
    render(
      <OptimizedImage
        alt="Cover"
        onError={onError}
        onLoad={onLoad}
        size={640}
        src={src}
      />,
    );
    const image = screen.getByRole<HTMLImageElement>("img", { name: "Cover" });

    expect(image.src).toBe(
      buildOptimizationUrl(src, 640, window.location.origin),
    );
    fireEvent.error(image);

    expect(image.getAttribute("src")).toBe(src);
    expect(image.getAttribute("srcset")).toBeNull();
    expect(onError).not.toHaveBeenCalled();

    // Next.js waits for image decoding before forwarding onLoad.
    image.decode = () => Promise.resolve();
    fireEvent.load(image);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledOnce();
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it("reports an error only when the original source also fails", () => {
    const onError = vi.fn<NonNullable<OptimizedImageProps["onError"]>>();
    render(
      <OptimizedImage alt="Cover" onError={onError} size={640} src={src} />,
    );
    const image = screen.getByRole("img", { name: "Cover" });

    fireEvent.error(image);
    expect(onError).not.toHaveBeenCalled();

    fireEvent.error(image);
    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0]?.[0].target).toBe(image);
    expect(image.getAttribute("src")).toBe(src);
  });

  it("uses the updated optimized source when src or size changes", () => {
    const { rerender } = render(
      <OptimizedImage alt="Cover" size={640} src={src} />,
    );
    const image = screen.getByRole("img", { name: "Cover" });
    fireEvent.error(image);
    expect(image.getAttribute("src")).toBe(src);

    const nextSrc = "https://cdn-p.smehost.net/other-cover.jpg";
    rerender(<OptimizedImage alt="Cover" size={640} src={nextSrc} />);
    expect(image.getAttribute("src")).toBe(buildOptimizationUrl(nextSrc, 640));

    fireEvent.error(image);
    expect(image.getAttribute("src")).toBe(nextSrc);

    rerender(<OptimizedImage alt="Cover" size={64} src={nextSrc} />);
    expect(image.getAttribute("src")).toBe(buildOptimizationUrl(nextSrc, 64));
  });
});

describe("FolgenCover image fallback", () => {
  it("keeps the original image mounted and reveals it when it loads", async () => {
    render(<FolgenCover coverUrl={src} folgenTitle="Falsche Schuld" />);
    const image = screen.getByAltText<HTMLImageElement>(
      "Cover für Falsche Schuld",
    );

    fireEvent.error(image);

    expect(screen.getByAltText("Cover für Falsche Schuld")).toBe(image);
    expect(image.getAttribute("src")).toBe(src);
    expect(screen.queryByText("Falsche Schuld")).toBeNull();

    image.decode = () => Promise.resolve();
    fireEvent.load(image);

    await waitFor(() => {
      expect(image.style.visibility).toBe("visible");
    });
    expect(image.style.opacity).toBe("1");
  });

  it("shows the title placeholder only after both sources fail", () => {
    render(<FolgenCover coverUrl={src} folgenTitle="Falsche Schuld" />);
    const image = screen.getByAltText("Cover für Falsche Schuld");

    fireEvent.error(image);
    fireEvent.error(image);

    expect(screen.queryByAltText("Cover für Falsche Schuld")).toBeNull();
    expect(screen.getByText("Falsche Schuld")).toBeTruthy();
  });
});
