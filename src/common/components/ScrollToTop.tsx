import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import styled from 'styled-components';

export default function ScrollToTop() {
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('scroll', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleVisibility);
    };
  }, []);

  const handleVisibility = () => {
    const { scrollY, innerHeight } = window;

    setVisible(scrollY >= 100);
    setAtBottom(innerHeight + scrollY >= document.body.offsetHeight - 20);
  };

  const handleClick = () => {
    window.scroll({ top: 0, behavior: 'smooth' });

    if (router.query.ref) {
      router.replace('/', '/', { shallow: true }); // removes url query params
    }
  };

  return (
    <ScrollTopContainer ref={scrollTopRef} style={{ opacity: visible ? 1 : 0 }}>
      <button
        aria-label="Scroll Top"
        onClick={handleClick}
        style={{
          transform: atBottom ? `translateY(-100%)` : `translateY(0px)`,
        }}
      >
        <AiOutlineArrowUp size={32} />
      </button>
    </ScrollTopContainer>
  );
}

const ScrollTopContainer = styled.div`
  position: fixed;
  z-index: 15;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: all 200ms ease-in;
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;

  button {
    transition: transform 200ms ease-in;
  }
`;
