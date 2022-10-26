import { useEffect } from 'react';

import { colors } from '@/constants/theme';

import { isSafari } from '../utils';

/**
 * Styles the document body in in relation to the `sortBy` prop
 * @param sortBy
 */
export function useBackgroundSortTheme(sortBy: string) {
  useEffect(() => {
    const element = document.body;

    if (!isSafari()) {
      let background = '';

      const gradient = `${colors.blueShades[0]} 0%, ${colors.blueShades[1]} 50%, ${colors.blueShades[2]} 100%`;

      switch (sortBy) {
        case 'dateAsc':
          background = `linear-gradient(0deg, ${gradient})`;
          break;
        case 'dateDesc':
          background = `linear-gradient(180deg, ${gradient})`;
          break;
        default:
          background = '';
      }

      element.style.background = background;
    }

    return () => {
      element.style.removeProperty('background');
    };
  }, [sortBy]);
}
