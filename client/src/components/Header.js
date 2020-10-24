import React from 'react';
import { Link } from 'react-router-dom';

import Search from './Search';
import logoPng from '../assets/logo.png';

const Header = () => {
  const style = {
    height: '36px'
  }

  return (
    <header>
      <div style={style} className="home-link">
        <Link to="/#"><img src={logoPng}/></Link>
      </div>
      <Search />
    </header>
  );
}

export default Header;