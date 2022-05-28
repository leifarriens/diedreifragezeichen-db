import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styled from 'styled-components';

import { GlobalContext } from '../../context/GlobalContext';

const Search = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { setSearchQuery, searchQuery } = useContext(GlobalContext);
  const router = useRouter();
  const [focus, setFocus] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ref.current?.blur();

      if (router.pathname !== '/') {
        router.push({
          pathname: '/',
          // search: '?' + new URLSearchParams({ search: e.target.value }).toString(),
        });
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearInput = () => setSearchQuery('');

  return (
    <SearchContainer>
      <input
        ref={ref}
        name="search"
        value={searchQuery}
        placeholder="Name, Nummer oder Erscheinungsjahr"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyPress={handleKeyDown}
        onChange={handleSearchChange}
      />
      {searchQuery && (
        <ClearButton color={focus ? '#000' : '#fff'} onClick={clearInput}>
          <AiOutlineCloseCircle size="20" />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-40%);
  color: ${(props) => props.color};
  opacity: 0.65;
`;

export default Search;
