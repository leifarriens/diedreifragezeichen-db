import styled from 'styled-components';

export const Container = styled.header`
  z-index: 100;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 48px;
  padding-left: 24px;
  padding-right: 24px;
  background: ${(props) => props.background};
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
    background-color: transparent;
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    font-size: inherit;
    padding: 10px 24px;
    border-radius: 25px;
    border: none;
    width: 100%;
    outline: none;
    border: 2px solid #fff;
    transition: all 150ms ease;
    /* border-radius: 8px; */
    opacity: 0.65;

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
  pointer-events: none;
  grid-area: profile;

  * {
    pointer-events: all;
  }
`;

export const CloseLoginButton = styled.button`
  &:hover {
    opacity: 0.85;
  }
`;
