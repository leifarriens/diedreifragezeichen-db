import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/client';
import React, { useContext } from 'react';
import Headroom from 'react-headroom';

import { GlobalContext } from '../../context/GlobalContext';
import SearchInput from './Search';
import { Container, HomeLink, ProfileLink, SearchBar } from './StyledHeader';

const Header = ({ transparent, simple = false }) => {
  const { setSearchQuery } = useContext(GlobalContext);
  const [session, loading] = useSession();
  const router = useRouter();

  const handleHomeClick = () => {
    setSearchQuery('');

    if (router.route !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const gradient = `linear-gradient(
    0deg,
    rgba(0, 23, 39, 0) 0%,
    rgba(0, 23, 39, 0.6) 40%,
    rgba(0, 23, 39, 0.85) 100%
  )`;

  const background = !transparent ? gradient : null;

  return (
    <Headroom style={{ pointerEvents: 'none' }}>
      <Container background={background}>
        <HomeLink onClick={handleHomeClick} />

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
                  aria-label="Folgen Bewerten"
                  className="button red"
                  onClick={() => signIn()}
                >
                  Folgen Bewerten
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
      </Container>
    </Headroom>
  );
};

export default Header;
