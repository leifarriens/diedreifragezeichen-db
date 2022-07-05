import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

export default function Footer() {
  return (
    <>
      <PageFooter>
        {/* <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/datenschutz">
          <a>Datenschutz</a>
        </Link>
        <a
          href="https://github.com/leifarriens/diedreifragezeichen-db"
          rel="noopener noreferrer"
          target="_blank"
        >
          Mitwirken
        </a>
        <a rel="noopener noreferrer" target="_blank">
          Unterstützen
        </a> */}
      </PageFooter>

      {/* <Signatur>
        Developed with 🐦 by{' '}
        <a
          href="https://leifarriens.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          Leif Arriens
        </a>
      </Signatur> */}
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
    transition: color 150ms ease-out;

    &:hover {
      opacity: 0.85;
    }
  }

  > :not(:last-child) {
    margin-right: 12px;
  }
`;

// const Signatur = styled.div`
//   margin: 0 18px 18px 0;
//   text-align: right;
//   font-size: 0.65rem;
//   color: ${colors.gray};

//   bottom: 0;
//   right: 0;
//   z-index: 20;

//   @media screen and (min-width: 1080px) {
//     font-size: 0.8rem;
//   }

//   a {
//     text-decoration: underline;
//     transition: color 150ms ease-out;

//     &:hover {
//       opacity: 0.85;
//     }
//   }
// `;
