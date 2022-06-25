import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import { useGlobalState } from '../../context/GlobalContext';
import { colors } from '../../theme';
import SearchInput from './Search';
import {
  CloseLoginButton,
  Container,
  HomeLink,
  ProfileLink,
  SearchBar,
} from './StyledHeader';

type HeaderProps = {
  transparent?: boolean;
  simple?: boolean;
  solid?: boolean;
};

const Header = ({
  transparent = false,
  simple = false,
  solid = false,
}: HeaderProps) => {
  const { setSearchQuery } = useGlobalState();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setSearchQuery('');
    if (router.route === '/') {
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (router.query.id) {
      return router.push(`/?ref=${router.query.id}`);
    }

    return router.push('/');
  };

  const gradient = `linear-gradient(
    0deg,
    rgba(0, 23, 39, 0) 0%,
    rgba(0, 23, 39, 0.6) 40%,
    rgba(0, 23, 39, 0.85) 100%
  )`;

  const background = transparent ? '' : solid ? colors.darkblue : gradient;

  return (
    <Container background={background} className="wrapper stretch">
      <HomeLink href="/" onClick={handleHomeClick}>
        <img src="/logo.png" alt="Logo" />
      </HomeLink>

      {!simple && (
        <SearchBar>
          <SearchInput />
        </SearchBar>
      )}

      {!loading && router.pathname !== '/signin' && (
        <ProfileLink>
          {!session ? (
            <span>
              <button
                aria-label="Anmelden"
                className="button red"
                onClick={() => signIn()}
              >
                Anmelden
              </button>
            </span>
          ) : router.pathname === '/profil' ? (
            <span>
              <button
                aria-label="Ausloggen"
                className="button red"
                onClick={() => signOut()}
              >
                Abmelden
              </button>
            </span>
          ) : (
            <div>
              <Link href="/profil">
                <a className="button blue">Profil</a>
              </Link>
            </div>
          )}
        </ProfileLink>
      )}
      {router.pathname === '/signin' && (
        <ProfileLink>
          <CloseLoginButton onClick={router.back}>
            <AiOutlineClose size={28} />
          </CloseLoginButton>
        </ProfileLink>
      )}
    </Container>
  );
};

export default Header;
