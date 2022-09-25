import { useCallback, useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 1000) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setState(value);
    }, delay);

    return () => clearTimeout(debounce);
  }, [value, delay]);

  return state;
}

export function useDebounceEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList | undefined,
  delay = 500,
) {
  useEffect(() => {
    const debounce = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay].concat(deps));
}
