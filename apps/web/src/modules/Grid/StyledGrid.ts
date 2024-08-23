import styled from 'styled-components';

export const GridUI = styled.div`
  margin-top: 22px;
  margin-bottom: 22px;
  display: grid;
  row-gap: 2em;
  column-gap: 2em;
  align-items: center;

  @media (min-width: 820px) {
    grid-template-columns: 380px 1fr;
  }

  @media (min-width: 1180px) {
    grid-template-columns: 380px 1fr auto;
  }
`;

export const FolgenContainer = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  justify-items: center;

  @media screen and (min-width: 480px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media screen and (min-width: 720px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media screen and (min-width: 1020px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media screen and (min-width: 1660px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;
