import { useRef, useState } from 'react';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

type ExpandableParagraphProps = {
  text: string;
  previewLength: number;
};

export default function ExpandableParagraph({
  text,
  previewLength,
}: ExpandableParagraphProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [isBodyExtended, setIsBodyExtended] = useState(false);

  const textPreview = text.substring(0, previewLength);
  const textMore = text.substring(previewLength, text.length);

  const textExceedsPreviewLength = text.length > textPreview.length;

  function toggleMore() {
    if (isBodyExtended && ref.current) {
      const offset = window.innerHeight / 4;
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    }
    setIsBodyExtended((curr) => !curr);
  }

  return (
    <Container>
      <p ref={ref}>
        <span>{textPreview}</span>
        {textExceedsPreviewLength && !isBodyExtended && (
          <>
            <span>...</span>
            <button onClick={toggleMore}>{' mehr'}</button>
          </>
        )}
        {textExceedsPreviewLength && isBodyExtended && (
          <span className="more">{textMore}</span>
        )}
      </p>
      {isBodyExtended && <button onClick={toggleMore}>Weniger anzeigen</button>}
    </Container>
  );
}

const Container = styled.div`
  button {
    font-size: inherit;
    color: ${colors.gray};
  }
`;
