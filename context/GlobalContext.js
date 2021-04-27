import React, { useEffect, useReducer } from 'react';
import GlobalReducer from './GlobalReducer';

const initalState = {
  folgen: [],
  showSpecials: false,
  searchQuery: '',
  sortBy: 'dateDesc',
};

export const GlobalContext = React.createContext(initalState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState);

  const folgen = useFolgen();

  // Actions
  useEffect(() => {
    // console.log(folgen);
    if (folgen && folgen.length > 0) {
      console.log(folgen);
      console.log('set data');
      setFolgen(folgen);
    }
  }, [folgen]);

  useEffect(() => {
    const show = JSON.parse(localStorage.getItem('showSpecials')) || false;
    console.log(show);
    setShowSpecials(show);

    const sortBy = sessionStorage.getItem('sortBy') || 'dateDesc';
    setSortBy(sortBy);
  }, []);

  function setFolgen(newfolgen) {
    dispatch({
      type: 'SET_FOLGEN',
      payload: newfolgen,
    });
  }

  function setShowSpecials(show) {
    localStorage.setItem('showSpecials', show);

    dispatch({
      type: 'SET_SHOW_SPECIALS',
      payload: show,
    });
  }

  function setSearchQuery(query) {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: query,
    });
  }

  function setSortBy(sortBy) {
    sessionStorage.setItem('sortBy', sortBy);
    dispatch({
      type: 'SET_SORTBY',
      payload: sortBy,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        folgen: state.folgen,
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

import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useFolgen() {
  const { data, error } = useSWR('/api/folgen', fetcher);

  if (data) {
    return data;
  }
}
