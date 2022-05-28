import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import styled from 'styled-components';

export default function ScrollToTop() {
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleVisibility);
    };
  }, []);

  const handleVisibility = () => {
    const { scrollY, innerHeight } = window;

    setVisible(scrollY >= 100);
    setAtBottom(innerHeight + scrollY >= document.body.offsetHeight);
  };

  const handleClick = () => {
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScrollTopContainer
      ref={scrollTopRef}
      opacity={visible ? 1 : 0}
      bottom={atBottom ? '36px' : '18px'}
    >
      <button aria-label="Scroll Top" onClick={handleClick}>
        <AiOutlineArrowUp size={32} />
      </button>
    </ScrollTopContainer>
  );
}

const ScrollTopContainer = styled.div<{ bottom: string; opacity: number }>`
  position: fixed;
  z-index: 555;
  bottom: ${(props) => props.bottom};
  right: 18px;
  opacity: ${(props) => props.opacity};
  transition: all 200ms ease-in;
`;
