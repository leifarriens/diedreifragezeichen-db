import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Container, HomeLink } from './StyledHeader';

import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <HomeLink to={"/#"} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
      {!user ? <Link to="/login">Anmelden</Link> : <Link to="/profile">Profil</Link>}
    </Container>
  );
}

export default Header;