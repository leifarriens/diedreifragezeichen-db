import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const KeyBox = styled.div`
  border: 1px solid #ddd;
  border-color: ${(props) => props.color};
  border-radius: 8px;
  padding: 14px;
  display: inline-flex;
  margin: 0 10px;
  cursor: pointer;

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

  useEffect(() => {
    function onKeyup(e) {
      if (e.code === keyCode) {
        console.log(keyCode);
        onPress();
      }
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  });

  return (
    <KeyBox color={color} onClick={onPress}>
      <Icon color={color} size={size} />
    </KeyBox>
  );
}
