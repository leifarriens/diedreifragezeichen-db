import React, { useReducer } from 'react';
import GlobalReducer from './GlobalReducer';

const initalState = {
  searchQuery: ''
}

export const GlobalContext = React.createContext(initalState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState);

  // Actions
  function setSearchQuery(query) {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: query
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        searchQuery: state.searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}