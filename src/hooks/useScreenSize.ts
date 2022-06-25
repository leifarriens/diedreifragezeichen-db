import { useEffect, useState } from 'react';

type Screen = {
  width: number | undefined;
  height: number | undefined;
};

export default function useScreenSize(): Screen {
  const [screen, setScreen] = useState<Screen>({
    width: window.innerWidth || undefined,
    height: window.innerHeight || undefined,
  });

  const handleRezise = () =>
    setScreen({
      width: window.innerWidth,
      height: window.innerHeight,
    });

  useEffect(() => {
    window.addEventListener('resize', handleRezise);

    return () => {
      window.removeEventListener('resize', handleRezise);
    };
  }, []);

  return screen;
}
