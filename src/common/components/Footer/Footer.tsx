import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

export default function Footer() {
  return (
    <>
      <PageFooter>
        <Link href="/">Home</Link>

        <Link href="/datenschutz">Datenschutz</Link>

        <a
          href="https://github.com/leifarriens/diedreifragezeichen-db"
          rel="noopener noreferrer"
          target="_blank"
        >
          Mitwirken
        </a>
      </PageFooter>

      <Signatur>
        Developed with 🐦 by{' '}
        <a
          href="https://leifarriens.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          Leif Arriens
        </a>
      </Signatur>
    </>
  );
}

const PageFooter = styled.div`
  text-align: center;
  margin-top: 94px;
  margin-bottom: 47px;
  font-size: 0.85rem;
  color: ${colors.gray};
  line-height: 200%;

  a {
    display: inline-flex;
    transition: color 150ms ease-out;

    &:hover {
      opacity: 0.85;
    }

    &:not(:last-of-type) {
      margin-right: 12px;
    }
  }
`;

const Signatur = styled.div`
  display: none;
  margin: 0 18px 18px 0;
  text-align: right;
  font-size: 0.6rem;
  color: ${colors.gray};

  bottom: 0;
  right: 0;
  z-index: 20;

  @media screen and (min-width: 1080px) {
    font-size: 0.7rem;
  }

  a {
    text-decoration: underline;
    transition: color 150ms ease-out;

    &:hover {
      opacity: 0.85;
    }
  }
`;
