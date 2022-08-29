import qs from 'qs';
import React, { ReactNode, useEffect, useReducer } from 'react';

import { SortOptionsEnum } from '@/components/Grid/Sort';

import GlobalReducer, { ActionKind } from './GlobalReducer';

export type GlobalState = {
  showSpecials: boolean;
  searchQuery: string;
  sortBy: string;
  setShowSpecials: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (query: string) => void;
};

const initalState = {
  showSpecials: false,
  searchQuery: '',
  sortBy: 'dateDesc',
  setShowSpecials: () => {},
  setSearchQuery: () => {},
  setSortBy: () => {},
};

enum StorageNames {
  SHOW_SPECIALS = 'show_specials',
  SORT_BY = 'sort_by',
}

export const GlobalContext = React.createContext<GlobalState>(initalState);

export const GlobalProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState);

  useEffect(() => {
    const show = localStorage.getItem(StorageNames.SHOW_SPECIALS)
      ? JSON.parse(localStorage.getItem(StorageNames.SHOW_SPECIALS) || '')
      : false;

    setShowSpecials(show);

    const sortBy = sessionStorage.getItem(StorageNames.SORT_BY) || 'dateDesc';

    if (Object.keys(SortOptionsEnum).includes(sortBy)) {
      setSortBy(sortBy);
    }

    const queryString = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const searchQuery = queryString.search?.toString() || '';
    setSearchQuery(searchQuery);
  }, []);

  function setShowSpecials(show: boolean) {
    localStorage.setItem(StorageNames.SHOW_SPECIALS, JSON.stringify(show));

    dispatch({
      type: ActionKind.SET_SHOW_SPECIALS,
      payload: show,
    });
  }

  function setSearchQuery(query: string) {
    dispatch({
      type: ActionKind.SET_SEARCH_QUERY,
      payload: query,
    });
  }

  function setSortBy(sortBy: string) {
    sessionStorage.setItem(StorageNames.SORT_BY, sortBy);
    dispatch({
      type: ActionKind.SET_SORT_BY,
      payload: sortBy,
    });
  }

  return (
    <GlobalContext.Provider
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
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  return React.useContext(GlobalContext);
};
