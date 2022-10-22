import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';
import Wrapper from '@/layout/Wrapper';

/**
 * Headroom styles are injected by styles/global.scss
 */

export const Container = styled(Wrapper)`
  flex: 0; // override Wrapper default flex: 1
  z-index: 99;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 48px;
  padding-bottom: 48px;
  pointer-events: none;
  justify-self: start;

  @media (max-width: 744px) {
    padding-top: 18px;
    padding-bottom: 18px;
  }

  /* GRID */
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 16px;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'logo - profile'
    'search search search';
  grid-column-gap: 16px;
  grid-template-areas: 'logo search profile';

  @media (min-width: ${breakpoints.mobileHeader}) {
    grid-column-gap: 24px;
    grid-template-areas: 'logo search profile';
    background: none;
    top: 0;
  }

  * {
    pointer-events: all;
  }

  .right {
    flex: 1 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-area: profile;
  }
`;

export const HomeLink = styled.a`
  cursor: pointer;
  display: flex;
  height: 28px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  grid-area: logo;

  @media (min-width: ${breakpoints.mobileHeader}) {
    height: 36px;
  }

  img {
    width: auto;
  }
`;

export const CloseLoginButton = styled.button`
  &:hover {
    opacity: 0.85;
  }
`;
