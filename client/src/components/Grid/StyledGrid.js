import styled from 'styled-components';

export const GridContainer = styled.div`
  padding: 0 24px;

  @media (min-width: 375px) {
    padding: 0 24px;
  }

  @media (min-width: 744px) {
    padding: 0 40px;
  }

  @media (min-width: 1128px) {
    padding: 0 80px;
  }

  // transition: background 150ms ease; is not supported in css
  /* ${({ sortBy }) => sortBy === 'dateAsc' && `background: linear-gradient(0deg, #030F1A 0%, #001727 50%, #05182A 100%);`} */
  /* ${({ sortBy }) => sortBy === 'dateDesc' && `background: linear-gradient(180deg, #030F1A 0%, #001727 50%, #05182A 100%);`} */
`;

export const GridUI = styled.div`
  /* width: auto; */

  @media (min-width: 744px) {
    /* display: grid; */
    /* grid-template-columns: auto 1fr; */
  }
`;

export const FolgenContainer = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  justify-items: start;

  @media screen and (min-width:590px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  }

  @media screen and (min-width:744px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media screen and (min-width:1440px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
`;
