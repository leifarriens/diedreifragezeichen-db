import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';
import { colors } from '@/constants/theme';
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
  padding-top: 18px;
  padding-bottom: 18px;
  pointer-events: none;
  justify-self: start;
  background: linear-gradient(0deg, transparent, ${colors.darkblue});

  /* GRID */
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 16px;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'logo - profile'
    'search search search';
  grid-column-gap: 10px;
  grid-template-areas: 'logo search profile';

  @media (min-width: ${breakpoints.mobileHeader}) {
    padding-top: 48px;
    padding-bottom: 48px;
    grid-template-columns: auto 340px 1fr;
    grid-column-gap: 20px;
    grid-template-areas: 'logo search profile';
  }

  * {
    pointer-events: all;
  }
`;

export const HomeLink = styled.a`
  height: 26px;
  width: auto;
  grid-area: logo;

  @media (min-width: ${breakpoints.mobileHeader}) {
    height: 36px;
  }
`;
