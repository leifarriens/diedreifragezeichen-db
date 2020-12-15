import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { GlobalContext } from '../../context/GlobalContext';

const Search = () => {
  const ref = useRef();
  const { setSearchQuery, searchQuery } = useContext(GlobalContext);
  const history = useHistory();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      ref.current.blur();
      history.push('/');
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      value={searchQuery}
      placeholder="DB durchsuchen..."
      onKeyPress={handleKeyDown}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

export default Search;