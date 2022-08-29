import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from './shared/Button';

type SocialLoginButtonProps = {
  name: string;
  icon: ReactNode;
  bgColor: string;
  color: string;
  onClick: () => void;
};

export default function SocialLoginButton({
  name,
  icon,
  bgColor,
  color,
  onClick,
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
    >
      <span>{icon}</span>
      <span>Mit {name} anmelden</span>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  font-weight: 400;
  justify-content: center;
  font-weight: 600;

  * + * {
    margin-left: 6px;
  }
`;
