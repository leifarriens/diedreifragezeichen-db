import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const KeyBox = styled.div`
  border: 1px solid #ddd;
  border-color: ${(props) => props.color};
  border-radius: 8px;
  padding: 14px;
  display: inline-flex;
  margin: 0 10px;
  cursor: pointer;
  opacity: ${(props) => props.opacity};

  :hover {
    opacity: 0.5;
  }
`;

export const KeyContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export function Key({ icon, color = '#ddd', size = 22, onPress, keyCode }) {
  const Icon = icon;

  const [keydown, setKeydown] = useState(false);

  useEffect(() => {
    function onKeydown(e) {
      if (e.key === keyCode) {
        setKeydown(true);
      }
    }

    function onKeyup(e) {
      if (e.key === keyCode) {
        setKeydown(false);
        onPress();
      }
    }
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('keyup', onKeyup);
    };
  });

  return (
    <KeyBox color={color} onClick={onPress} opacity={keydown ? 0.5 : 1}>
      <Icon color={color} size={size} />
    </KeyBox>
  );
}
