import React from 'react';
import styled from 'styled-components';
// import { FaSpotify } from 'react-icons/fa';

const PageFooter = styled.div`
  text-align: center;
  margin-top: 94px;
  margin-bottom: 18px;
  font-size: 0.85rem;
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
  font-size: 0.65rem;
  color: #9a9a9a;
  bottom: 0;
  right: 0;
  z-index: 20;

  @media screen and (min-width: 1080px) {
    font-size: 0.85rem;
  }
`;

export default function Footer() {
  return (
    <React.Fragment>
      <PageFooter>
        {/* <span>Powereded by </span>
        <a href="https://api.spotify.com/" target="_blank" rel="noreferrer"><FaSpotify /></a> */}
      </PageFooter>
      <Signatur>
        Developed with 🦜 by{' '}
        <a
          href="https://leifarriens.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leif Arriens
        </a>
      </Signatur>
    </React.Fragment>
  );
}
