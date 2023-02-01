import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styled from 'styled-components';

import { Loader } from '@/common/components/shared/Loader';
import { colors } from '@/constants/theme';
import { useDebounceEffect } from '@/hooks';
import { useGridState } from '@/modules/Grid';

import { trpc } from '../../utils/trpc';

const Search = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { setSearchQuery, searchQuery } = useGridState();
  const [value, setValue] = useState(searchQuery);
  const router = useRouter();

  useDebounceEffect(
    () => {
      setSearchQuery(value);
    },
    50,
    [value, setSearchQuery],
  );

  useEffect(() => {
    if (searchQuery === '') setValue('');
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ref.current?.blur();

      if (router.pathname !== '/') {
        router.push({ pathname: '/' });
      }
    }

    if (e.key === 'Escape') {
      ref.current?.blur();

      setValue('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue('');

  return (
    <div>
      <SearchContainer>
        <input
          ref={ref}
          name="search"
          value={value}
          placeholder="Name, Nummer oder Erscheinungsjahr"
          onKeyDown={handleKeyDown}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <ClearButton color={colors.white} onClick={clearInput}>
            <AiOutlineCloseCircle size="20" />
          </ClearButton>
        )}
      </SearchContainer>
      <SearchResults query={searchQuery} />
    </div>
  );
};

function SearchResults({ query }: { query: string }) {
  const { data, isInitialLoading } = trpc.folge.search.useInfiniteQuery(
    { query },
    { enabled: query.length > 2 },
  );

  return (
    <div className="relative">
      <div className="absolute left-0 top-2 w-full overflow-hidden rounded-lg bg-black">
        {isInitialLoading && <Loader />}
        {data?.pages.map((groupe, i) => (
          <React.Fragment key={i}>
            {groupe.items.map((folge) => {
              return (
                <Link
                  key={folge._id}
                  href={`/folge/${folge._id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-800 hover:bg-opacity-80"
                >
                  <img src={folge.images[2].url} className="h-12 w-12" alt="" />
                  <div>{folge.name}</div>
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  grid-area: search;

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
