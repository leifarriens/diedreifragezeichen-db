export default (state, action) => {
  switch (action.type) {
    case 'SET_FOLGEN':
      return {
        ...state,
        folgen: action.payload,
      };
    case 'SET_SHOW_SPECIALS':
      return {
        ...state,
        showSpecials: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_SORTBY':
      return {
        ...state,
        sortBy: action.payload,
      };
    default:
      return state;
  }
};
