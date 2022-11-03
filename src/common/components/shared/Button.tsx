import styled from 'styled-components';

import { colors } from '@/constants/theme';

const Button = styled.button<{
  color?: string;
  ghost?: boolean;
  size?: 'default' | 'small';
}>`
  cursor: pointer;
  display: inline-flex;
  gap: 0.7em;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  padding: 0.7em 1.4em;
  border-radius: 8px;
  font-size: ${({ size }) => (size === 'small' ? '0.8em' : '1em')};
  font-weight: 500;
  letter-spacing: 0.02rem;
  transition: all 150ms ease-in;
  background-color: ${({ color, ghost }) => !ghost && color && color};
  border-color: ${({ color, ghost }) => !ghost && color && color};
  border: ${(props) => props.ghost && 'None'};

  &:hover:not(:disabled) {
    color: ${({ color }) => !color && colors.black};
    background-color: ${({ color }) => (color ? color : colors.white)};
    background-color: ${({ ghost, color }) => ghost && color};
  }

  :disabled {
    opacity: 0.75;
    cursor: not-allowed;
    filter: saturate(0);
  }
`;

export default Button;
