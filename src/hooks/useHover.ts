import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

export default function useHover<T>(): [MutableRefObject<T>, boolean] {
  const [hover, setHover] = useState(false);
  const ref: any = useRef<T | null>(null);

  const handleMouseOver = (): void => setHover(true);
  const handleMouseOut = (): void => setHover(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
    return;
  }, [ref.current]);

  return [ref, hover];
}
