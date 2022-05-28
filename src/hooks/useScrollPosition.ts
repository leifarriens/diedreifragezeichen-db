import { useEffect, useState } from 'react';

export default function useScrollPosition(): number {
  const [scroll, setScroll] = useState<number>(0);

  const handleScroll = (): void => setScroll(window.scrollY);

  useEffect(() => {
    setScroll(window.scrollY), window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scroll;
}
