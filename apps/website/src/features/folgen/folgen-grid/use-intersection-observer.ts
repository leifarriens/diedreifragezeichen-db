import { type RefObject, useEffect, useState } from "react";

interface ObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    triggerOnce = false,
  }: ObserverOptions = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Prevent re-observing if already visible and triggerOnce is true
    if (triggerOnce && isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setIsIntersecting(visible);

        if (visible && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce, isIntersecting]);

  return isIntersecting;
}
