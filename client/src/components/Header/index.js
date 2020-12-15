import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
import Search from './Search';

import { AuthContext } from '../../context/AuthContext';
import { GlobalContext } from '../../context/GlobalContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { setSearchQuery } = useContext(GlobalContext);

  const handleHomeClick = () => {
    setSearchQuery('');
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <Container>
      <HomeLink to="/#" onClick={handleHomeClick} />
      
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