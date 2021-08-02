import React, { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import { colors } from '../theme';

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const StlyedToast = styled.div`
  z-index: 9999;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.15);
  background-color: ${(props) => props.bgColor};
  border-radius: 6px;
  padding: 16px;
  width: auto;
`;

function Toast({ duration = 3000, onFadeOut, children }) {
  const [inProp, setInProp] = useState(false);

  const transitionDuration = 300;

  const defaultStyle = {
    transition: `all ${transitionDuration}ms ease-in-out`,
    opacity: 0,
  };

  useEffect(() => {
    setInProp(true);

    const timeout = setTimeout(() => {
      setInProp(false);
      setTimeout(() => {
        onFadeOut();
      }, transitionDuration);
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  const transitionStyles = {
    entering: { opacity: 1, transform: 'translate(0px)' },
    entered: { opacity: 1, transform: 'translate(0px)' },
    exiting: { opacity: 0, transform: 'translateY(100px)' },
    exited: { opacity: 0, transform: 'translateY(100px)' },
  };

  return (
    <Container>
      <Transition in={inProp} timeout={150}>
        {(state) => (
          <StlyedToast
            bgColor={colors.lightblue}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {children}
          </StlyedToast>
        )}
      </Transition>
    </Container>
  );
}

export default Toast;
