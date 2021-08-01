import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import styled from 'styled-components';

const ScrollTopContainer = styled.div`
  position: fixed;
  z-index: 555;
  bottom: 48px;
  right: 18px;
  transition: opacity 100ms ease;
`;

const ScrollToTop = () => {
  const scrollTopRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', _handleVisibility);

    return () => {
      window.removeEventListener('scroll', _handleVisibility);
    };
  }, []);

  const _handleVisibility = () => {
    const t = document.body.getBoundingClientRect().top;
    setVisible(t < -window.innerHeight / 3);
  };

  const _handleClick = () => {
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScrollTopContainer ref={scrollTopRef} style={{ opacity: visible ? 1 : 0 }}>
      <button
        aria-label="Scroll Top"
        className="button round"
        onClick={_handleClick}
      >
        <AiOutlineArrowUp />
      </button>
    </ScrollTopContainer>
  );
};

export default ScrollToTop;
