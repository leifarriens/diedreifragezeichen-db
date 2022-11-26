import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import { SortOptionsEnum } from '@/modules/Grid/types';
import { isSafari } from '@/utils/index';

/**
 * Styles the document body in in relation to the `sortBy` prop
 * @param sortBy
 */
export function useBackgroundSortTheme(
  sortBy: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  useEffect(() => {
    const element = document.body;

    if (enabled && !isSafari()) {
      let background = '';

      const gradient = `${colors.blueShades[0]} 0%, ${colors.blueShades[1]} 50%, ${colors.blueShades[2]} 100%`;

      switch (sortBy) {
        case SortOptionsEnum.dateAsc:
          background = `linear-gradient(45deg, ${gradient})`;
          break;
        case SortOptionsEnum.dateDesc:
          background = `linear-gradient(225deg, ${gradient})`;
          break;
        default:
          background = '';
      }

      element.style.background = background;
    }

    return () => {
      element.style.removeProperty('background');
    };
  }, [sortBy, enabled]);
}
