import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';

export const Container = styled.div`
  padding: 2em;
  padding-top: 2em;
  margin-bottom: 6em;

  @media screen and (min-width: 720px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 40px;
  }

  @media screen and (min-width: 1080px) {
    grid-column-gap: 64px;
  }
`;

export const Cover = styled.div`
  display: block;
  height: auto;
  width: 100%;

  img {
    height: auto;
    width: 100%;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 15px 4px #00000050;
  }
`;

export const Content = styled.div`
  h1 {
    margin-bottom: 0;
  }

  > div {
    margin-bottom: 8px;
  }
`;

export const Buttons = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;

  * + * {
    margin-left: 1em;
  }
`;

export const Background = styled.div<{ bigCover: boolean }>`
  z-index: -1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: ${(props) => (props.bigCover ? '120% 140%' : '150% 150%')};
  background-position: ${(props) =>
    props.bigCover ? 'right bottom' : 'center 93%'};
  background-repeat: no-repeat;
  transform: scale(1.15);
  filter: blur(80px) brightness(65%);

  @media screen and (min-width: 720px) {
    filter: blur(80px) brightness(35%);
  }

  /* Disables blurred background on firefox due to bad filter performance */
  @-moz-document url-prefix() {
    /* filter: none; */
    display: none;
  }
`;

export const RatingContainer = styled.div`
  font-size: 2.2em;
  font-family: 'Cochin';
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const ReleaseContainer = styled.div`
  font-size: 1.2em;
  margin-top: 6px;
  color: #ddd;
`;

export const Inhalt = styled.div`
  font-size: 1.1em;
  line-height: 150%;
  color: #eee;
  border-radius: 8px;
  margin-bottom: 4em;

  @media screen and (min-width: ${breakpoints.mobileHeader}) {
    padding: 2em;
    background-color: rgba(0, 0, 0, 0.3);
  }

  h3 {
    margin-bottom: 1em;
    font-size: 1.25em;
    font-weight: 500;
  }

  p {
    text-align: justify;
  }
`;
