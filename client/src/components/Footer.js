import React from 'react';
import styled from 'styled-components';
import { FaSpotify } from 'react-icons/fa';

const PageFooter = styled.div`
  text-align: center;
  margin-top: 94px;
  margin-bottom: 18px;
  font-size: .85rem;
  color: #c7c7c7;
  line-height: 200%;

  svg {
    position: relative;
    top: 2px;
    left: 2px;
  }
`;

const Signatur = styled.div`
  margin: 0 18px 18px 0;
  position: fixed;
  font-size: .65rem;
  color: #c7c7c7;
  bottom: 0;
  right: 0;
  z-index: 20;

  @media screen and (min-width:1080px) {
    font-size: .85rem;
  }
`;

const Fade = styled.div`
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 64px;
  bottom: 0;
  left: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,23,39,0) 0%, rgba(0,23,39,.85) 100%);
`;

const Footer = () => {
  return (
    <React.Fragment>
      <PageFooter>
        <span>Powereded by </span>
        {/* <a href="https://api.spotify.com/" target="_blank">Spotify API </a> */}
        {/* <FaSpotify /> */}
        <a href="https://api.spotify.com/" target="_blank"><FaSpotify /></a>
      </PageFooter>
      <Signatur>Developed with 💗 by <a href="https://leifarriens.github.io/" target="_blank">Leif Arriens</a></Signatur>
      <Fade />
    </React.Fragment>
  )
}

export default Footer;