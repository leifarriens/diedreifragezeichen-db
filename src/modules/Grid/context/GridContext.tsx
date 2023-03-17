import qs from 'qs';
import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer } from 'react';

import { SortOptionsEnum } from '@/modules/Grid/types';

import GridReducer, { ActionKind } from './GridReducer';

export type GridState = {
  showSpecials: boolean;
  searchQuery: string;
  sortBy: SortOptionsEnum;
  setShowSpecials: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (query: string) => void;
};

const initalState = {
  showSpecials: false,
  searchQuery: '',
  sortBy: SortOptionsEnum.dateDesc,
  setShowSpecials: () => {},
  setSearchQuery: () => {},
  setSortBy: () => {},
};

enum StorageNames {
  SHOW_SPECIALS = 'show_specials',
  SORT_BY = 'sort_by',
}

export const GridContext = createContext<GridState>(initalState);

export const GridProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [state, dispatch] = useReducer(GridReducer, initalState);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({
      type: ActionKind.SET_SEARCH_QUERY,
      payload: query,
    });
  }, []);

  const setSortBy = useCallback((sortBy: string) => {
    sessionStorage.setItem(StorageNames.SORT_BY, sortBy);
    if (Object.values(SortOptionsEnum).includes(sortBy as SortOptionsEnum)) {
      dispatch({
        type: ActionKind.SET_SORT_BY,
        payload: sortBy as SortOptionsEnum,
      });
    }
  }, []);

  const setShowSpecials = useCallback((show: boolean) => {
    localStorage.setItem(StorageNames.SHOW_SPECIALS, JSON.stringify(show));

    dispatch({
      type: ActionKind.SET_SHOW_SPECIALS,
      payload: show,
    });
  }, []);

  useEffect(() => {
    const show = localStorage.getItem(StorageNames.SHOW_SPECIALS)
      ? JSON.parse(localStorage.getItem(StorageNames.SHOW_SPECIALS) || '')
      : false;

    setShowSpecials(show);

    const sortBy =
      (sessionStorage.getItem(StorageNames.SORT_BY) as SortOptionsEnum) ||
      'dateDesc';

    if (Object.keys(SortOptionsEnum).includes(sortBy)) {
      setSortBy(sortBy);
    }

    const queryString = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const searchQuery = queryString.search?.toString() || '';
    setSearchQuery(searchQuery);
  }, [setSortBy, setSearchQuery, setShowSpecials]);

  return (
    <GridContext.Provider
      value={{
        showSpecials: state.showSpecials,
        setShowSpecials,
        searchQuery: state.searchQuery,
        setSearchQuery,
        sortBy: state.sortBy,
        setSortBy,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
