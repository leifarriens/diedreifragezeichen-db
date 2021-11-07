import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import Headroom from 'react-headroom';
import { AiOutlineClose } from 'react-icons/ai';

import { useGlobalState } from '../../context/GlobalContext';
import SearchInput from './Search';
import {
  CloseLoginButton,
  Container,
  HomeLink,
  ProfileLink,
  SearchBar,
} from './StyledHeader';

const Header = ({ transparent = false, simple = false }) => {
  const { setSearchQuery } = useGlobalState();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
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

  const background = transparent ? '' : gradient;

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
                  aria-label="Anmelden"
                  className="button red"
                  onClick={signIn}
                >
                  Anmelden
                </button>
              </span>
            ) : router.pathname === '/profil' ? (
              <span>
                <button
                  aria-label="Ausloggen"
                  className="button red"
                  onClick={signOut}
                >
                  Ausloggen
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
    </Headroom>
  );
};

export default Header;
