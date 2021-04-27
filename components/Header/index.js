import React, { useContext } from 'react';
import Link from 'next/link';
import Headroom from 'react-headroom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
import SearchInput from './Search';
import { signIn, signOut, useSession } from 'next-auth/client';

// import { AuthContext } from '../../context/AuthContext';
import { GlobalContext } from '../../context/GlobalContext';

const Header = () => {
  // const { auth } = useContext(AuthContext);
  const { setSearchQuery } = useContext(GlobalContext);
  // const auth = false;

  const handleHomeClick = () => {
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [session, loading] = useSession();

  return (
    <Headroom style={{pointerEvents: 'none'}}>
      <Container>
        <Link href="/#">
          <HomeLink onClick={handleHomeClick} />
        </Link>

        <SearchBar>
          <SearchInput />
        </SearchBar>

        <ProfileLink>
          {!session ? (
            <span>
              <button onClick={() => signIn()}>Anmelden</button>
            </span>
          ) : (
            <div>
              <Link href="/profile">
                <a>
                  <AiOutlineProfile size={28} />
                </a>
              </Link>
            </div>
          )}
        </ProfileLink>
      </Container>
    </Headroom>
  );
};

export default Header;
