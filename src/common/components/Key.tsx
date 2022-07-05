import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type KeyProps = {
  icon: React.ElementType<{ color: string; size: number }>;
  color: string;
  size: number;
  keyCode: string;
  onPress: () => void;
};

export function Key({
  icon: Icon,
  color = '#ddd',
  size = 22,
  onPress,
  keyCode,
}: KeyProps) {
  const [keydown, setKeydown] = useState(false);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === keyCode) {
        setKeydown(true);
      }
    }

    function onKeyup(e: KeyboardEvent) {
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

const KeyBox = styled.div<{ color: string; opacity: number }>`
  border: 1px solid #ddd;
  border-color: ${(props) => props.color};
  border-radius: 8px;
  padding: 14px;
  display: inline-flex;
  margin: 0 10px;
  cursor: pointer;
  opacity: ${(props) => props.opacity};
  transition: opacity 150ms ease-out;

  :hover {
    opacity: 0.5;
  }
`;

export const KeyContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
  grid-column: 1/3;
`;
