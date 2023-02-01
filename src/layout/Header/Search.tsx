import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { Loader } from '@/common/components/shared/Loader';
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

  useEffect(() => {
    function handleRouteChange() {
      setValue('');
    }

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue('');

  return (
    <div
      className="relative w-full"
      // eslint-disable-next-line no-inline-styles/no-inline-styles
      style={{ gridArea: 'search' }}
    >
      <input
        ref={ref}
        autoComplete="off"
        name="search"
        value={value}
        placeholder="Name, Nummer oder Erscheinungsjahr"
        className="w-full rounded-3xl bg-black bg-opacity-80 py-[10px] px-6 text-white backdrop-blur-sm backdrop-brightness-50 transition-all"
        onKeyDown={handleKeyDown}
        onChange={handleSearchChange}
      />

      {value && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-[45%] text-neutral-300"
          onClick={clearInput}
        >
          <AiOutlineCloseCircle size={20} />
        </button>
      )}

      {router.pathname !== '/' && <SearchResults query={searchQuery} />}
    </div>
  );
};

function SearchResults({ query }: { query: string }) {
  const { data, isInitialLoading } = trpc.folge.search.useInfiniteQuery(
    { query },
    { enabled: query.length > 1 },
  );

  return (
    <div className="relative">
      <div className="absolute top-4 left-0 w-full overflow-hidden rounded-lg bg-black">
        {isInitialLoading && <Loader />}
        {data?.pages.map((groupe, i) => (
          <React.Fragment key={i}>
            {groupe.items.map(({ _id, name, images }) => {
              return (
                <Link
                  key={_id}
                  href={`/folge/${_id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-800 hover:bg-opacity-80"
                >
                  <img src={images[2].url} className="h-12 w-12" alt="" />
                  <div>{name}</div>
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Search;
