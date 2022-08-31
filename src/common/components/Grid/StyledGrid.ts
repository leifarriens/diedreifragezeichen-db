import styled from 'styled-components';

export const GridContainer = styled.div`
  flex: 1;
`;

export const GridUI = styled.div`
  margin-top: 22px;
  margin-bottom: 22px;
  display: grid;
  row-gap: 12px;
  column-gap: 12px;
  align-items: center;

  @media (min-width: 744px) {
    grid-template-columns: 1fr auto;
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

  @media screen and (min-width: 1020px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media screen and (min-width: 1440px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media screen and (min-width: 1660px) {
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;

export const FolgenCounter = styled.div`
  > :not(:last-child) {
    margin-right: 12px;
  }
`;
