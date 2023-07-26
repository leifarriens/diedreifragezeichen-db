import qs from 'qs';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { SortOptionsEnum } from '@/modules/Grid/types';

import { ActionKind, GridReducer } from './GridReducer';

export interface GridState {
  showSpecials: boolean;
  showOnlyUnrated: boolean;
  searchQuery: string;
  sortBy: SortOptionsEnum;
  setShowSpecials: (show: boolean) => void;
  setShowOnlyUnrated: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (query: string) => void;
}

const initalState = {
  showSpecials: false,
  showOnlyUnrated: false,
  searchQuery: '',
  sortBy: SortOptionsEnum.dateDesc,
  setShowSpecials: () => {},
  setShowOnlyUnrated: () => {},
  setSearchQuery: () => {},
  setSortBy: () => {},
};

enum StorageNames {
  SHOW_SPECIALS = 'show_specials',
  SHOW_ONLY_RUNRATED = 'show_only_unrated',
  SORT_BY = 'sort_by',
}

export const GridContext = createContext<GridState>(initalState);

export function GridProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
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

  const setShowOnlyUnrated = useCallback((onlyUnrated: boolean) => {
    localStorage.setItem(
      StorageNames.SHOW_ONLY_RUNRATED,
      JSON.stringify(onlyUnrated),
    );

    dispatch({
      type: ActionKind.SET_SHOW_ONLY_UNRATED,
      payload: onlyUnrated,
    });
  }, []);

  useEffect(() => {
    const show = localStorage.getItem(StorageNames.SHOW_SPECIALS)
      ? (JSON.parse(
          localStorage.getItem(StorageNames.SHOW_SPECIALS) ?? '',
        ) as boolean)
      : false;

    setShowSpecials(show);

    const showOnlyUnrated = localStorage.getItem(
      StorageNames.SHOW_ONLY_RUNRATED,
    )
      ? (JSON.parse(
          localStorage.getItem(StorageNames.SHOW_ONLY_RUNRATED) ?? '',
        ) as boolean)
      : false;

    setShowOnlyUnrated(showOnlyUnrated);

    const sortBy =
      (sessionStorage.getItem(StorageNames.SORT_BY) as
        | SortOptionsEnum
        | undefined) ?? 'dateDesc';

    if (Object.keys(SortOptionsEnum).includes(sortBy)) {
      setSortBy(sortBy);
    }

    const queryString = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const searchQuery = queryString.search?.toString() ?? '';
    setSearchQuery(searchQuery);
  }, [setSortBy, setSearchQuery, setShowSpecials, setShowOnlyUnrated]);

  const value = useMemo(
    () => ({
      showSpecials: state.showSpecials,
      setShowOnlyUnrated,
      showOnlyUnrated: state.showOnlyUnrated,
      setShowSpecials,
      searchQuery: state.searchQuery,
      setSearchQuery,
      sortBy: state.sortBy,
      setSortBy,
    }),
    [state, setSearchQuery, setShowOnlyUnrated, setShowSpecials, setSortBy],
  );

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}
