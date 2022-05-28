// import Link from 'next/link';

import { PageFooter, Signatur } from './StyledFooter';

export default function Footer() {
  return (
    <>
      <PageFooter>
        {/* <span>Powereded by </span>
        <a href="https://api.spotify.com/" target="_blank" rel="noreferrer">
          <FaSpotify />
        </a> */}
        {/* <Link href="https://github.com/leifarriens/diedreifragezeichen-db">
          <a>Contribute</a>
        </Link> */}
      </PageFooter>

      <Signatur>
        Developed with 🦜 by{' '}
        <a
          href="https://leifarriens.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leif Arriens
        </a>
      </Signatur>
    </>
  );
}
