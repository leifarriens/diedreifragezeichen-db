import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';

/**
 * Headroom styles are injected by styles/global.css
 */

export const Container = styled.div`
  pointer-events: none;

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
