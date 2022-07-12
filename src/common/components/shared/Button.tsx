import styled from 'styled-components';

import { colors } from '@/constants/theme';

const Button = styled.button<{ color?: string; ghost?: boolean }>`
  cursor: pointer;
  display: inline-block;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.02rem;
  transition: all 150ms ease-in;
  background-color: ${({ color, ghost }) => !ghost && color && color};
  border-color: ${({ color, ghost }) => !ghost && color && color};
  border: ${(props) => props.ghost && 'None'};

  &:hover {
    color: ${({ color }) => !color && colors.black};
    background-color: ${({ color }) => (color ? color : colors.white)};
    background-color: ${({ ghost, color }) => ghost && color};
  }
`;

export default Button;