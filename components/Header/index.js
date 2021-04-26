import React, { useContext } from 'react'
import Link from 'next/Link'
import Headroom from 'react-headroom'
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader'
import { AiOutlineProfile } from 'react-icons/ai'
import Search from './Search'
import { signIn, signOut, useSession } from 'next-auth/client'

// import { AuthContext } from '../../context/AuthContext';
import { GlobalContext } from '../../context/GlobalContext'

const Header = () => {
  // const { auth } = useContext(AuthContext);
  const { setSearchQuery } = useContext(GlobalContext)
  // const auth = false;

  const handleHomeClick = () => {
    setSearchQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [session, loading] = useSession()

  return (
    <Headroom>
      <Container>
        <Link href="/#">
          <HomeLink onClick={handleHomeClick} />
        </Link>

        <SearchBar>
          <Search />
        </SearchBar>

        <ProfileLink>
          {!session ? (
            <button onClick={() => signIn()}>Anmelden</button>
          ) : (
            <div>
              <span>Hallo, {session.user.name}</span>
              <Link href="/profile">
                <a>
                  <AiOutlineProfile size={28} />
                </a>
              </Link>
              <button onClick={() => signOut()}>Logout</button>
            </div>
          )}
        </ProfileLink>
      </Container>
    </Headroom>
  )
}

export default Header
