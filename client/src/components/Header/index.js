import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
// import Headroom from 'react-headroom';
import Search from './Search';

import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <HomeLink to="/#" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
      
      <SearchBar>
        <Search />
      </SearchBar>

      <ProfileLink>
        {!user ?
          <Link to="/login">Anmelden</Link> :
          <Link to="/profile">
            <AiOutlineProfile size={28} />
          </Link>
        }
      </ProfileLink>

    </Container>
  );
}

export default Header;