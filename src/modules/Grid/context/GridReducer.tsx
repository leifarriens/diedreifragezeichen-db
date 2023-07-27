import type { SortOptionsEnum } from '@/modules/Grid/types';

import type { GridState } from './GridContext';

export enum ActionKind {
  SET_SHOW_SPECIALS = 'SET_SHOW_SPECIALS',
  SET_SHOW_ONLY_UNRATED = 'SET_SHOW_ONLY_UNRATED',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_SORT_BY = 'SET_SORTBY',
}

type Action =
  | { type: ActionKind.SET_SHOW_SPECIALS; payload: boolean }
  | { type: ActionKind.SET_SHOW_ONLY_UNRATED; payload: boolean }
  | { type: ActionKind.SET_SEARCH_QUERY; payload: string }
  | { type: ActionKind.SET_SORT_BY; payload: SortOptionsEnum };

export function GridReducer(state: GridState, action: Action) {
  switch (action.type) {
    case ActionKind.SET_SHOW_SPECIALS:
      return {
        ...state,
        showSpecials: action.payload,
      };
    case ActionKind.SET_SHOW_ONLY_UNRATED:
      return {
        ...state,
        showOnlyUnrated: action.payload,
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
