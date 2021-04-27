import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Headroom from 'react-headroom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
import SearchInput from './Search';
import { signIn, useSession } from 'next-auth/client';

import { GlobalContext } from '../../context/GlobalContext';

const Header = () => {
  const { setSearchQuery } = useContext(GlobalContext);
  const router = useRouter();

  const handleHomeClick = () => {
    setSearchQuery('');
    
    if (router.route !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [session, loading] = useSession();

  return (
    <Headroom style={{pointerEvents: 'none'}}>
      <Container>
        {/* <Link href="/#"> */}
          <HomeLink onClick={handleHomeClick} />
        {/* </Link> */}

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
