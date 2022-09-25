import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleRezise() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleRezise);

    return () => window.removeEventListener('resize', handleRezise);
  }, []);

  return size;
}
