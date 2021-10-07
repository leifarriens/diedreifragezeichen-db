import styled from 'styled-components';

import { colors } from '../../theme';

export const Cover = styled.div`
  width: 100%;
  height: auto;
  transition: all 150ms ease-out;
  transform-origin: bottom;

  :hover {
    transform: scale(1.05);
  }

  @media (pointer: coarse) {
    :hover {
      transform: none;
    }
  }

  img {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

export const FolgeContainer = styled.article`
  position: relative;
  width: 100%;
`;

export const NewBadge = styled.span`
  z-index: 50;
  position: absolute;
  right: -10px;
  top: -6px;
  background-color: ${colors.lightblue};
  padding: 4px 6px;
  border-radius: 4px;
  text-transform: capitalize;
  box-shadow: 0 0 15px 0px rgba(0, 0, 0, 0.15);
`;
