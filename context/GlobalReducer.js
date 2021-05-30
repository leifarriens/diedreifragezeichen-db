export default function GlobalReducer(state, action) {
  switch (action.type) {
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
}
