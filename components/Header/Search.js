import React, { useContext, useRef } from 'react';
import { useRouter } from 'next/router';

import { GlobalContext } from '../../context/GlobalContext';

const Search = () => {
  const ref = useRef();
  const { setSearchQuery, searchQuery } = useContext(GlobalContext);
  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      ref.current.blur();
      router.push({
        pathname: '/',
        // search: '?' + new URLSearchParams({ search: e.target.value }).toString(),
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      ref={ref}
      type="text"
      value={searchQuery}
      placeholder="'Name', 'Nummer', 'Erscheinungsjahr'"
      onKeyPress={handleKeyDown}
      onChange={handleSearchChange}
    />
  );
};

export default Search;
