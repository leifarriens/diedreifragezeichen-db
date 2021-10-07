import qs from 'qs';
import React, { useEffect, useReducer } from 'react';

import GlobalReducer from './GlobalReducer';

const initalState = {
  showSpecials: false,
  searchQuery: '',
  sortBy: 'dateDesc',
};

export const GlobalContext = React.createContext(initalState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState);

  useEffect(() => {
    const show = JSON.parse(localStorage.getItem('showSpecials')) || false;

    setShowSpecials(show);

    const sortBy = sessionStorage.getItem('sortBy') || 'dateDesc';
    setSortBy(sortBy);

    const queryString = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const searchQuery = queryString.search || '';
    setSearchQuery(searchQuery);
  }, []);

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
