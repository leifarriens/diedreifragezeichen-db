import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Button } from '@/components/shared';

interface SocialLoginButtonProps {
  name: string;
  icon: ReactNode;
  bgColor: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function SocialLoginButton({
  name,
  icon,
  bgColor,
  color,
  onClick,
  disabled,
}: SocialLoginButtonProps) {
  return (
    <StyledButton
      aria-label={`${name} Login`}
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        borderColor: bgColor,
        color: color,
      }}
      disabled={disabled}
    >
      <i>{icon}</i>
      <span>Mit {name} anmelden</span>
    </StyledButton>
  );
}

const StyledButton = styled(Button)<{ disbaled?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  font-weight: 400;
  justify-content: center;
  align-items: center;
  font-weight: 600;

  i {
    display: flex;
  }

  ${(props) =>
    props.disabled &&
    css`
      ::after {
        position: absolute;
        content: 'Derzeit nicht verfügbar';
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 8px;
        font-size: 0.9em;
      }
    `}
`;
