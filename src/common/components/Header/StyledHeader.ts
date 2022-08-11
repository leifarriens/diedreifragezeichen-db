import styled from 'styled-components';

import Wrapper from '@/layout/Wrapper';

export const Container = styled(Wrapper)`
  flex: 0; // override Wrapper default flex: 1
  position: sticky;
  /* top: 0; */
  /* top: -56px; */
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
  /* backdrop-filter: blur(2px); */

  @media (min-width: 540px) {
    grid-column-gap: 24px;
    grid-template-areas: 'logo search profile';
    background: none;
    top: 0;
  }

  * {
    pointer-events: all;
  }
`;

export const HomeLink = styled.a`
  cursor: pointer;
  display: flex;
  height: 36px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  grid-area: logo;

  img {
    width: auto;
  }
`;

export const ProfileLink = styled.div`
  flex: 1 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-area: profile;
`;

export const CloseLoginButton = styled.button`
  &:hover {
    opacity: 0.85;
  }
`;
