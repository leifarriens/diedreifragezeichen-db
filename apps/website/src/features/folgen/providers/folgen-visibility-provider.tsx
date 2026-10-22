import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";

export const IntersectionObserverContext =
  createContext<null | RegisterIntersectionObserver>(null);

type RegisterIntersectionObserver = (
  element: Element,
  onChange: (isIntersecting: boolean) => void,
) => () => void;

export function FolgenVisibilityProvider({ children }: PropsWithChildren) {
  const callbacksRef = useRef<Map<
    Element,
    (isIntersecting: boolean) => void
  > | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const register = useCallback<RegisterIntersectionObserver>(
    (element, onChange) => {
      const callbacks = (callbacksRef.current ??= new Map<
        Element,
        (isIntersecting: boolean) => void
      >());
      callbacks.set(element, onChange);
      observerRef.current?.observe(element);

      return () => {
        callbacks.delete(element);
        observerRef.current?.unobserve(element);
      };
    },
    [],
  );

  useEffect(() => {
    const callbacks = (callbacksRef.current ??= new Map<
      Element,
      (isIntersecting: boolean) => void
    >());
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry.isIntersecting);
      }
    });

    observerRef.current = observer;
    for (const element of callbacks.keys()) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <IntersectionObserverContext value={register}>
      {children}
    </IntersectionObserverContext>
  );
}
