import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

type ToastProps = {
  duration: number;
  onFadeOut?: () => void;
  children: ReactNode | ReactNode[];
  color: string;
};

export default function Toast({
  duration = 3000,
  onFadeOut,
  color = colors.lightblue,
  children,
}: ToastProps) {
  const [inProp, setInProp] = useState(false);
  const [hover, setHover] = useState(false);

  const transitionDuration = 200;

  const defaultStyle = {
    transition: `all ${transitionDuration}ms ease-in-out`,
    opacity: 0,
  };

  const hide = useCallback(() => {
    if (hover) return;

    setInProp(false);

    if (onFadeOut) {
      setTimeout(() => {
        onFadeOut();
      }, transitionDuration);
    }
  }, [onFadeOut, hover]);

  useEffect(() => {
    setInProp(true);

    const timeout = setTimeout(() => {
      hide();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, hide]);

  const transitionStyles = {
    entering: { opacity: 1, transform: 'translateY(100px)' },
    entered: { opacity: 1, transform: 'translateY(0)' },
    exiting: { opacity: 0, transform: 'translateY(100px)' },
    exited: { opacity: 0, transform: 'translateY(100px)' },
    unmounted: { opacity: 0, transform: 'translateY(100px)' },
  };

  return createPortal(
    <Transition in={inProp} timeout={150}>
      {(state) => (
        <StlyedToast
          bgColor={color}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {children}
        </StlyedToast>
      )}
    </Transition>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector('#toastPortal')!,
  );
}

const StlyedToast = styled.div<{ bgColor: string }>`
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.15);
  background-color: ${(props) => props.bgColor};
  border-radius: 6px;
  padding: 16px;
  width: auto;
  pointer-events: all;
`;
