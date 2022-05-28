import type { GlobalState } from './GlobalContext';

export enum ActionKind {
  SET_SHOW_SPECIALS = 'SET_SHOW_SPECIALS',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_SORT_BY = 'SET_SORTBY',
}

type Action = {
  type: ActionKind;
  payload?: any;
};

export default function GlobalReducer(state: GlobalState, action: Action) {
  switch (action.type) {
    case ActionKind.SET_SHOW_SPECIALS:
      return {
        ...state,
        showSpecials: action.payload,
      };
    case ActionKind.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case ActionKind.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
      };
    default:
      return state;
  }
}
