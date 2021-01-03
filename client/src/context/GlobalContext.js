import React, { useReducer } from 'react';
import GlobalReducer from './GlobalReducer';

const initalState = {
  showSpecials: false,
  searchQuery: '',
  sortBy: 'dateDesc'
}

export const GlobalContext = React.createContext(initalState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState);

  // Actions
  function setShowSpecials(show) {
    dispatch({
      type: 'SET_SHOW_SPECIALS',
      payload: show
    });
  }

  function setSearchQuery(query) {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: query
    });
  }

  function setSortBy(sortBy) {
    dispatch({
      type: 'SET_SORTBY',
      payload: sortBy
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
        setSortBy
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
