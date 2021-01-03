import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';
import { Container, HomeLink, SearchBar, ProfileLink } from './StyledHeader';
import { AiOutlineProfile } from 'react-icons/ai';
import Search from './Search';

import { AuthContext } from '../../context/AuthContext';
import { GlobalContext } from '../../context/GlobalContext';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const { setSearchQuery } = useContext(GlobalContext);

  const handleHomeClick = () => {
    setSearchQuery('');
    window.scrollTo({top: 0, behavior: 'smooth'})
  };

  return (
    <Headroom>
      <Container>
        <HomeLink to="/#" onClick={handleHomeClick} />
        
        <SearchBar>
          <Search />
        </SearchBar>

        <ProfileLink>
          {!auth.data ?
            <Link to="/login">Anmelden</Link> :
            <Link to="/profile">
              <AiOutlineProfile size={28} />
            </Link>
          }
        </ProfileLink>

      </Container>
    </Headroom>
  );
};

export default Header;