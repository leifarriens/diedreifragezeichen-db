import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styled from 'styled-components';

import { colors } from '@/constants/theme';
import { GlobalContext } from '@/context/GlobalContext';
import { useDebounceEffect } from '@/hooks';

const Search = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { setSearchQuery, searchQuery } = useContext(GlobalContext);
  const [value, setValue] = useState(searchQuery);
  const router = useRouter();

  useDebounceEffect(
    () => {
      setSearchQuery(value);
    },
    50,
    [value, setSearchQuery],
  );

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
    setValue(e.target.value);
  };

  const clearInput = () => setValue(''); //setSearchQuery('');

  return (
    <SearchContainer>
      <input
        ref={ref}
        name="search"
        value={value}
        placeholder="Name, Nummer oder Erscheinungsjahr"
        onKeyPress={handleKeyDown}
        onChange={handleSearchChange}
      />
      {searchQuery && (
        <ClearButton color={colors.white} onClick={clearInput}>
          <AiOutlineCloseCircle size="20" />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  grid-area: search;

  @media (min-width: 744px) {
    width: 350px;
  }

  input {
    background-color: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    padding: 10px 24px;
    border-radius: 25px;
    border: none;
    width: 100%;
    transition: all 150ms ease;
    backdrop-filter: brightness(35%) blur(2px);
  }
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
