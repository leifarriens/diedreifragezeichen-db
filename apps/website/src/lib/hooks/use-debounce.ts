import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying updates until after the specified delay.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This effect runs 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 500): T {
  // Wrap the value so React does not treat function values as initializers.
  const [debouncedValue, setDebouncedValue] = useState(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Wrap the value so React does not treat function values as updaters.
      setDebouncedValue(() => value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
