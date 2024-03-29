import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { Loader } from '@/components/shared';
import { useDebounceEffect } from '@/hooks';
import { useGridState } from '@/modules/Grid';
import { trpc } from '@/utils/trpc';

export function Search() {
  const ref = useRef<HTMLInputElement | null>(null);
  const { setSearchQuery, searchQuery } = useGridState();
  const [value, setValue] = useState(searchQuery);
  const router = useRouter();

  useDebounceEffect(
    () => {
      setSearchQuery(value);
    },
    150,
    [value, setSearchQuery],
  );

  useEffect(() => {
    if (searchQuery === '') setValue('');
  }, [searchQuery]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ref.current?.blur();

      if (router.pathname !== '/') {
        await router.push({ pathname: '/' });
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

  const shouldHideSearchResults =
    router.pathname === '/' || router.pathname.includes('admin');

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
        className="w-full rounded-3xl bg-black bg-opacity-80 px-6 py-[8px] text-[16px] text-white backdrop-blur-sm backdrop-brightness-50 transition-all sm:py-[10px]"
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

      {!shouldHideSearchResults && <SearchResults query={searchQuery} />}
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const { data, isInitialLoading } = trpc.folge.search.useInfiniteQuery(
    { query },
    {
      enabled: query.length > 1,
      trpc: {
        abortOnUnmount: true,
      },
    },
  );

  if (!isInitialLoading && !data) return null;

  return (
    <div className="relative">
      <ul className="absolute left-0 top-4 w-full overflow-hidden rounded-lg bg-black py-2">
        {isInitialLoading && <Loader />}
        {data?.pages.map((groupe, i) => (
          <React.Fragment key={i}>
            {groupe.items.map(({ _id, name, number, images }) => {
              return (
                <li
                  key={_id}
                  className="px-1 hover:bg-neutral-800 hover:bg-opacity-80"
                >
                  <Link
                    href={`/folge/${_id}`}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <img
                      src={images[2].url}
                      className="h-14 w-14 rounded-sm"
                      alt=""
                    />
                    <div className="font-semibold">
                      {number && <span>{Number(number).toString()}: </span>}
                      {name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </React.Fragment>
        ))}
        {data?.pages.length === 1 && data.pages[0].items.length === 0 && (
          <div className="py-3 text-center text-neutral-300">
            Keine Ergebnisse
          </div>
        )}
      </ul>
    </div>
  );
}
