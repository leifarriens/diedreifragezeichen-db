import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import { SortOptionsEnum } from '@/modules/Grid/types';
import { isSafari } from '@/utils/index';

/**
 * Styles the document body in in relation to the `sortBy` prop
 * @param sortBy
 */
export function useBackgroundSortTheme(
  sortBy: SortOptionsEnum,
  { enabled = true }: { enabled?: boolean } = {},
) {
  useEffect(() => {
    const element = document.body;

    if (enabled && !isSafari()) {
      const gradient = `${colors.blueShades[0]} 0%, ${colors.blueShades[1]} 50%, ${colors.blueShades[2]} 100%`;
      const background =
        sortBy === SortOptionsEnum.dateAsc
          ? `linear-gradient(45deg, ${gradient})`
          : sortBy === SortOptionsEnum.dateDesc
            ? `linear-gradient(225deg, ${gradient})`
            : '';

      element.style.background = background;
    }

    return () => {
      element.style.removeProperty('background');
    };
  }, [sortBy, enabled]);
}
