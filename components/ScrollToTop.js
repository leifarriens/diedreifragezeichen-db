import styled from 'styled-components';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';

const ScrollTopContainer = styled.div`
  position: fixed;
  z-index: 555;
  bottom: 48px;
  right: 48px;
  transition: opacity 200ms ease;
`;

const ScrollToTop = () => {
  const scrollTopRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', _handleVisibility);

    return () => {
      window.removeEventListener('scroll', _handleVisibility);
    }
  }, []);

  const _handleVisibility = () => {
    const t = document.body.getBoundingClientRect().top;
    setVisible(t < -window.innerHeight / 2);
  }

  const _handleClick = () => {
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  // if (!visible) return null;

  return (
    <ScrollTopContainer ref={scrollTopRef} style={{ opacity: visible ? 1 : 0 }}>
      <button className="button round" onClick={_handleClick}>
        <AiOutlineArrowUp />
      </button>
    </ScrollTopContainer>
  );
};

export default ScrollToTop;
