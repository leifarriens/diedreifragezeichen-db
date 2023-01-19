import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Image } from '@/models/folge';

import { Background, Overlay } from './StyledFolge';

type CoverProps = {
  images: Image[];
  alt: string;
  coverOnly: boolean;
};

export default function Cover({ images, alt, coverOnly }: CoverProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const src = images[1].url;

  return (
    <div ref={ref}>
      {!coverOnly && (
        <>
          <Background />
          <Overlay
            style={{ ...(isLoaded && { backgroundImage: `url(${src})` }) }}
          />
        </>
      )}
      <div className="relative flex aspect-square h-auto w-full items-center justify-center overflow-hidden">
        {inView && (
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
