import Link from 'next/link';

import { PageFooter, Signatur } from './StyledFooter';

export default function Footer() {
  return (
    <>
      <PageFooter>
        <Link href="/">
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
        </a>
      </PageFooter>

      <Signatur>
        Developed with 🥧 by{' '}
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
