// @vitest-environment jsdom

import type { ImageProps } from "expo-image";
import type { ComponentProps, PropsWithChildren } from "react";

import { buildOptimizationUrl } from "@ddfdb/image-optimization";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

const image = vi.hoisted(() => {
  vi.stubEnv("EXPO_PUBLIC_DDFDB_API_URL", "https://ddfdb.de");
  const props: ImageProps = {};
  return { props };
});

vi.mock("expo-image", () => ({
  Image: (props: ImageProps) => {
    image.props = props;
    return null;
  },
}));
vi.mock("react-native", () => ({
  StyleSheet: { absoluteFill: { position: "absolute" } },
  View: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

import { OptimizedImage } from "./optimized-image";

const apiUrl = "https://ddfdb.de";
const firstCover = "https://dreimetadaten.de/data/Serie/001/cover.jpg";
const secondCover = "https://dreimetadaten.de/data/Serie/002/cover.jpg";

function failImage() {
  act(() => image.props.onError?.({ error: "Image unavailable" }));
}

function loadImage(url: string) {
  act(() =>
    image.props.onLoad?.({
      cacheType: "disk",
      source: {
        height: 640,
        isAnimated: false,
        mediaType: "image/jpeg",
        url,
        width: 640,
      },
    }),
  );
}

function renderImage(
  props: Partial<ComponentProps<typeof OptimizedImage>> = {},
) {
  return render(
    <OptimizedImage
      imageSize={640}
      imageUrl={firstCover}
      placeholder={<span>Loading cover</span>}
      {...props}
    />,
  );
}

afterEach(cleanup);
afterAll(() => vi.unstubAllEnvs());

describe("OptimizedImage", () => {
  it("updates the source when a recycled row receives a different cover", () => {
    const { rerender } = renderImage();
    loadImage(buildOptimizationUrl(firstCover, 640, apiUrl));
    expect(screen.queryByText("Loading cover")).toBeNull();

    rerender(
      <OptimizedImage
        imageSize={640}
        imageUrl={secondCover}
        placeholder={<span>Loading cover</span>}
      />,
    );

    const uri = buildOptimizationUrl(secondCover, 640, apiUrl);
    expect(image.props.source).toMatchObject({ uri });
    expect(image.props.recyclingKey).toBe(uri);
    expect(screen.queryByText("Loading cover")).not.toBeNull();

    loadImage(uri);
    expect(screen.queryByText("Loading cover")).toBeNull();
  });

  it("keeps image variants out of the old URL-only cache", () => {
    const { unmount } = renderImage({ imageSize: 64 });
    const backgroundSource = image.props.source;
    expect(backgroundSource).toMatchObject({
      cacheKey: `64:${buildOptimizationUrl(firstCover, 64, apiUrl)}`,
    });
    unmount();

    renderImage();
    expect(image.props.source).toMatchObject({
      cacheKey: `640:${buildOptimizationUrl(firstCover, 640, apiUrl)}`,
    });
    expect(image.props.source).not.toEqual(backgroundSource);
  });

  it("updates the optimized source when the requested size changes", () => {
    const { rerender } = renderImage({ imageSize: 64 });
    rerender(<OptimizedImage imageSize={640} imageUrl={firstCover} />);

    expect(image.props.source).toMatchObject({
      uri: buildOptimizationUrl(firstCover, 640, apiUrl),
    });
  });

  it("falls back to the original image with its own cache entry", () => {
    const onError = vi.fn();
    const onLoad = vi.fn();
    renderImage({ onError, onLoad });
    failImage();

    expect(image.props.source).toEqual({
      cacheKey: `640:${firstCover}`,
      uri: firstCover,
    });
    expect(image.props.recyclingKey).toBe(firstCover);
    expect(screen.queryByText("Loading cover")).not.toBeNull();

    // A cached or redirected image can report a different URL than the request.
    loadImage("file:///cached-cover.jpg");
    expect(screen.queryByText("Loading cover")).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("resets fallback state when the source changes, including revisiting a cover", () => {
    const { rerender } = renderImage();
    failImage();

    rerender(<OptimizedImage imageSize={640} imageUrl={secondCover} />);
    expect(image.props.source).toMatchObject({
      uri: buildOptimizationUrl(secondCover, 640, apiUrl),
    });

    rerender(<OptimizedImage imageSize={640} imageUrl={firstCover} />);
    expect(image.props.source).toMatchObject({
      uri: buildOptimizationUrl(firstCover, 640, apiUrl),
    });
  });

  it("ignores late load and error events from the previous source", () => {
    const { rerender } = renderImage();
    const previousError = image.props.onError;
    const previousLoad = image.props.onLoad;

    rerender(
      <OptimizedImage
        imageSize={640}
        imageUrl={secondCover}
        placeholder={<span>Loading cover</span>}
      />,
    );
    const uri = buildOptimizationUrl(secondCover, 640, apiUrl);
    loadImage(uri);

    act(() => {
      previousError?.({ error: "Previous request failed" });
      previousLoad?.({
        cacheType: "none",
        source: {
          height: 640,
          isAnimated: false,
          mediaType: "image/jpeg",
          url: buildOptimizationUrl(firstCover, 640, apiUrl),
          width: 640,
        },
      });
    });

    expect(image.props.source).toMatchObject({ uri });
    expect(screen.queryByText("Loading cover")).toBeNull();
  });
});
