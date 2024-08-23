import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import { MultiRangeInput, Switch } from '@/components/shared';
import type { FolgeWithId } from '@/models/folge';

import { GridFolge } from './components/GridFolge';
import { Sort } from './components/Sort';
import { useFolgenWithUserRatings, useGridState } from './hooks';
import { useBackgroundSortTheme } from './hooks';
import { FolgenContainer, GridUI } from './StyledGrid';
import { applyFilter } from './utils/filter';

interface GridProps {
  folgen: FolgeWithId[];
  isFiltered?: boolean;
  showUi?: boolean;
}

const initialYearRange = {
  min: 1979,
  max: dayjs().year(),
};

export function Grid(props: GridProps) {
  const { isFiltered = false, showUi = false } = props;
  const {
    searchQuery,
    sortBy,
    setSortBy,
    showSpecials,
    setShowSpecials,
    showOnlyUnrated,
    setShowOnlyUnrated,
  } = useGridState();
  const { status } = useSession();

  const [yearRange, setYearRange] = useState(initialYearRange);

  const folgen = useFolgenWithUserRatings(props.folgen);

  useBackgroundSortTheme(sortBy, { enabled: showUi });

  const filteredFolgen = useMemo(() => {
    if (!isFiltered) return folgen;
    return applyFilter(folgen, {
      showSpecials,
      searchQuery,
      sortBy,
      showOnlyUnrated,
      yearRange: {
        min: dayjs().year(yearRange.min).toDate(),
        max: dayjs().year(yearRange.max).toDate(),
      },
    });
  }, [
    folgen,
    showSpecials,
    searchQuery,
    sortBy,
    isFiltered,
    yearRange,
    showOnlyUnrated,
  ]);

  useEffect(() => {
    if (
      yearRange.min !== initialYearRange.min ||
      yearRange.max !== initialYearRange.max
    ) {
      window.scrollTo({ top: 0 });
    }
  }, [yearRange]);

  return (
    <div className="flex-1">
      {showUi && (
        <>
          <GridUI>
            <Sort currentSort={sortBy} onSortChange={setSortBy} />

            <MultiRangeInput
              min={1979}
              max={dayjs().year()}
              onChange={setYearRange}
            />

            <div className="flex gap-3">
              {status === 'authenticated' && (
                <Switch
                  checked={showOnlyUnrated}
                  label="Nicht bewerted"
                  onChange={setShowOnlyUnrated}
                />
              )}
              <Switch
                checked={showSpecials}
                label="Specials"
                onChange={setShowSpecials}
              />
            </div>
          </GridUI>

          <div className="mb-8 font-semibold">
            {filteredFolgen.length}{' '}
            {filteredFolgen.length === 1 ? 'Folge' : 'Folgen'}
            {showOnlyUnrated && (
              <span className="text-neutral-400"> (nicht bewertet)</span>
            )}
          </div>
        </>
      )}

      {props.folgen.length > 0 && (
        <FolgenContainer>
          {filteredFolgen.map((folge) => (
            <GridFolge
              key={folge._id}
              folge={folge}
              userRating={folge.user_rating}
            />
          ))}
        </FolgenContainer>
      )}
    </div>
  );
}
