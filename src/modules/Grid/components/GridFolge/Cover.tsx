import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import type { Image } from '@/models/folge';

import { Background, Overlay } from './StyledFolge';

interface CoverProps {
  images: Image[];
  alt: string;
}

export function Cover({ images, alt }: CoverProps) {
  const { ref, inView: isInView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const src = images[1].url;

  return (
    <div ref={ref}>
      <Background />
      <Overlay
        style={{ ...(isLoaded && { backgroundImage: `url(${src})` }) }}
      />
      <div className="relative flex aspect-square h-auto w-full items-center justify-center overflow-hidden">
        {isInView && (
          <img
            src={src}
            alt={alt}
            className="rounded-xl shadow-lg transition-all duration-150 ease-in"
            style={{
              visibility: !isLoaded ? 'hidden' : 'visible',
              opacity: !isLoaded ? 0 : 1,
            }}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
    </div>
  );
}
