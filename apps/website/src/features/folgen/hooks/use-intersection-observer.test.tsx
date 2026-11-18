// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FolgenVisibilityProvider } from "../providers/folgen-visibility-provider";
import { useIntersectionObserver } from "./use-intersection-observer";

const observers: TestIntersectionObserver[] = [];

class TestIntersectionObserver {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  readonly unobserve = vi.fn();

  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }

  emit(target: Element, isIntersecting: boolean) {
    const rect = target.getBoundingClientRect();
    const entry = {
      boundingClientRect: rect,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: rect,
      isIntersecting,
      rootBounds: null,
      target,
      time: 0,
    } satisfies IntersectionObserverEntry;

    this.callback([entry], this as unknown as IntersectionObserver);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("FolgenVisibilityProvider", () => {
  it("shares one observer and keeps it attached as visibility changes", () => {
    render(
      <FolgenVisibilityProvider>
        <VisibilityProbe id="first" />
        <VisibilityProbe id="second" />
      </FolgenVisibilityProvider>,
    );

    expect(observers).toHaveLength(1);

    const observer = observers[0];
    if (!observer) {
      throw new Error("Expected a shared IntersectionObserver");
    }

    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");

    expect(observer.observe).toHaveBeenCalledTimes(2);

    act(() => {
      observer.emit(first, true);
    });

    expect(first.textContent).toBe("visible");
    expect(second.textContent).toBe("hidden");
    expect(observers).toHaveLength(1);
    expect(observer.observe).toHaveBeenCalledTimes(2);

    act(() => {
      observer.emit(first, false);
    });

    expect(first.textContent).toBe("hidden");
    expect(observers).toHaveLength(1);
  });
});

function VisibilityProbe({ id }: { id: string }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(elementRef);

  return (
    <div data-testid={id} ref={elementRef}>
      {isIntersecting ? "visible" : "hidden"}
    </div>
  );
}
