import { useWindowSize } from './useWindowSize';

export function useBreakpoint(size: number) {
  const { width } = useWindowSize();

  return width > size;
}
