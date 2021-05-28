import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Headroom from 'react-headroom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
import SearchInput from './Search';
import { signIn, useSession } from 'next-auth/client';

import { GlobalContext } from '../../context/GlobalContext';

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
                <button className="button red" onClick={() => signIn()}>
                  Folgen Bewerten
                </button>
              </span>
            ) : (
              <div>
                <Link href="/profil">
                  <a className="button blue">
                    Profil
                    {/* <AiOutlineProfile size={26} /> */}
                  </a>
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
