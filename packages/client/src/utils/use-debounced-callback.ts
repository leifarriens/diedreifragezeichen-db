import { useCallback, useEffect, useRef } from "react";

/**
 * Creates a debounced version of a callback function.
 * The callback will only execute after the specified delay has passed
 * since the last invocation.
 *
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns A tuple containing [debouncedCallback, cancel]
 *
 * @example
 * const [debouncedSearch, cancel] = useDebouncedCallback((query: string) => {
 *   fetch(`/api/search?q=${query}`);
 * }, 300);
 *
 * // Call the debounced function
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 *
 * // Cancel pending calls if needed
 * <button onClick={cancel}>Cancel</button>
 */
export function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 500,
): [(...args: T) => void, () => void] {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debouncedCallback = useCallback(
    (...args: T) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, cancel],
  );

  return [debouncedCallback, cancel];
}
