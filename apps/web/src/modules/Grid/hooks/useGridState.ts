import { useContext } from 'react';

import { GridContext } from '../context/GridContext';

export const useGridState = () => {
  return useContext(GridContext);
};
