import type { RefObject } from "react";

import { use, useEffect, useState } from "react";

import { IntersectionObserverContext } from "../providers/folgen-visibility-provider";

export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
): boolean {
  const register = use(IntersectionObserverContext);
  const [isIntersecting, setIsIntersecting] = useState(false);

  if (!register) {
    throw new Error(
      "useIntersectionObserver must be used inside a FolgenVisibilityProvider",
    );
  }

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    return register(element, setIsIntersecting);
  }, [elementRef, register]);

  return isIntersecting;
}
