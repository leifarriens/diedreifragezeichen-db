import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

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
      <CoverContainer>
        {inView && (
          <img
            src={src}
            alt={alt}
            style={{
              visibility: !isLoaded ? 'hidden' : 'visible',
              opacity: !isLoaded ? 0 : 1,
            }}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </CoverContainer>
    </div>
  );
}

export const CoverContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    transition: border-radius 150ms, opacity 150ms ease-in;
    transition-timing-function: ease-out;
  }
`;
