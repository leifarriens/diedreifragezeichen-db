import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="text-center mt-24 mb-10 text-sm text-neutral-400">
        <Link
          className="transition-colors duration-150 mr-3 hover:text-neutral-200"
          href="/"
        >
          Home
        </Link>

        <Link
          className="transition-colors duration-150 mr-3 hover:text-neutral-200"
          href="/datenschutz"
        >
          Datenschutz
        </Link>

        <a
          className="transition-colors duration-150 hover:text-neutral-200"
          href="https://github.com/leifarriens/diedreifragezeichen-db"
          rel="noopener noreferrer"
          target="_blank"
        >
          Mitwirken
        </a>
      </div>

      {/* <div className="z-30 text-center text-sm mb-4 text-neutral-400">
        Developed with 🐦 by{' '}
        <a
          href="https://leifarriens.dev"
          className="hover:text-neutral-200"
          rel="noopener noreferrer"
          target="_blank"
        >
          Leif Arriens
        </a>
      </div> */}
    </>
  );
}
