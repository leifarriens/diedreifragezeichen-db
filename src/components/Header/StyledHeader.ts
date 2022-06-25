import styled from 'styled-components';

export const Container = styled.header<{ background: string }>`
  position: sticky;
  /* top: 0; */
  top: -56px;
  z-index: 99;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 48px !important;
  padding-bottom: 48px !important;
  background: ${(props) => props.background};
  pointer-events: none;

  @media (max-width: 744px) {
    padding-top: 18px !important;
    padding-bottom: 18px !important;
  }

  /* GRID */
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 16px;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'logo - profile'
    'search search search';
  background: transparent !important;

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

export const SearchBar = styled.div`
  width: 100%;
  grid-area: search;

  @media (min-width: 744px) {
    width: 350px;
  }

  input {
    background-color: rgba(0, 0, 0, 0.35);
    color: #fff;
    font-family: inherit;
    font-size: 1em;
    padding: 10px 24px;
    border-radius: 25px;
    border: none;
    width: 100%;
    outline: none;
    border: 2px solid rgba(255, 255, 255, 0.75);
    transition: all 150ms ease;

    &:focus {
      color: #000;
      background-color: #fff;
      opacity: 1;
    }
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
