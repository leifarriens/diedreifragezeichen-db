import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import logoPng from '../assets/logo.png';

const Header = () => {
  const { user, loadUserFromStorage } = useContext(AuthContext);

  const style = {
    height: '36px'
  }

  useEffect(() => {
    // loadUserFromStorage()
  }, []);

  return (
    <header>
      <div style={style} className="home-link">
        <Link to="/#"><img src={logoPng}/></Link>
      </div>
      {!user ? (
        <div>
          <Link to="/login">Login</Link>
        </div>
      ) : (
        <div>
          <Link to="/profile">Profile</Link>
        </div>
      )}
    </header>
  );
}

export default Header;