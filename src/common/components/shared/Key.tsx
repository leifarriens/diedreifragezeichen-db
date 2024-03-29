import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface KeyProps {
  icon: React.ElementType<{ color: string; size: number }>;
  color?: string;
  size?: number;
  keyCode?: string;
  disabled?: boolean;
  label: string;
  onPress?: () => void;
}

export function Key({
  icon: Icon,
  color = '#ddd',
  size = 22,
  onPress,
  label,
  keyCode,
  disabled = false,
}: KeyProps) {
  const [isKeydown, setIsKeydown] = useState(false);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === keyCode) {
        setIsKeydown(true);
      }
    }

    function onKeyup(e: KeyboardEvent) {
      if (e.key === keyCode) {
        setIsKeydown(false);
        if (onPress && !disabled) onPress();
      }
    }

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('keyup', onKeyup);
    };
  }, [disabled, keyCode, onPress]);

  return (
    <KeyBox
      color={color}
      disabled={disabled}
      onClick={onPress}
      aria-label={label}
      opacity={isKeydown || disabled ? 0.5 : 1}
    >
      <Icon color={color} size={size} />
    </KeyBox>
  );
}

const KeyBox = styled.button<{ color: string; opacity: number }>`
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
