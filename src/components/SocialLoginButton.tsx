import { ReactNode } from 'react';
import styled from 'styled-components';

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
      className="button"
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

const StyledButton = styled.button`
  width: 100%;
  display: flex;
  font-weight: 400;
  justify-content: center;

  span {
    margin-right: 6px;
    display: flex;
    align-items: center;
  }
`;
