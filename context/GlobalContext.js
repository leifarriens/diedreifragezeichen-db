import React, { useEffect, useReducer } from 'react'
import GlobalReducer from './GlobalReducer'

const initalState = {
  folgen: [],
  showSpecials: false,
  searchQuery: '',
  sortBy: 'dateDesc',
}

export const GlobalContext = React.createContext(initalState)

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initalState)

  // Actions
  useEffect(() => {
    const fetchFolgen = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/folgen')
        const folgen = await res.json()
        dispatch({
          type: 'SET_FOLGEN',
          payload: folgen,
        })
      } catch (err) {
        console.log(err.response)
      }
    }
    fetchFolgen()
  }, [])

  useEffect(() => {
    const show = JSON.parse(localStorage.getItem('showSpecials')) || false;
    console.log(show);
    setShowSpecials(show)

    const sortBy = sessionStorage.getItem('sortBy') || 'dateDesc'
    setSortBy(sortBy)
  }, [])

  function setShowSpecials(show) {
    localStorage.setItem('showSpecials', show)

    dispatch({
      type: 'SET_SHOW_SPECIALS',
      payload: show,
    })
  }

  function setSearchQuery(query) {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: query,
    })
  }

  function setSortBy(sortBy) {
    sessionStorage.setItem('sortBy', sortBy)
    dispatch({
      type: 'SET_SORTBY',
      payload: sortBy,
    })
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
      {state.folgen.length > 0 && children}
    </GlobalContext.Provider>
  )
}
