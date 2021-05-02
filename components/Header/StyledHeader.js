import styled from 'styled-components';

export const Container = styled.header`
  z-index: 10;
  color: #fff;
  position: sticky;
  top: 0;
  /* top: -18px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 48px;
  background: linear-gradient(
    0deg,
    rgba(0, 23, 39, 0) 0%,
    rgba(0, 23, 39, 0.85) 100%
  );
  pointer-events: none;

  /* GRID */
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'logo - profile'
    'search search search';

  @media (max-width: 744px) {
    padding-top: 18px;
  }

  @media (min-width: 375px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 744px) {
    grid-template-areas: 'logo search profile';
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (min-width: 1128px) {
    padding-left: 80px;
    padding-right: 80px;
  }

  * {
    pointer-events: all;
  }
`;

export const HomeLink = styled.a`
  cursor: pointer;
  flex: 0 0 auto;
  height: 36px;
  width: 62px;
  background-image: url('/logo.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  grid-area: logo;
`;

export const SearchBar = styled.div`
  width: 100%;
  grid-area: search;

  @media (min-width: 744px) {
    width: 350px;
  }

  input {
    font-family: inherit;
    font-size: 16px;
    font-size: inherit;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 1.2.rem;
    border: none;
    width: 100%;
    outline: none;
  }
`;

export const ProfileLink = styled.div`
  flex: 1 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  grid-area: profile;

  * {
    pointer-events: all;
  }
`;
