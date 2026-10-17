import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying updates until after the specified delay.
 */
export function useDebouncedValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(() => value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
