import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import { Switch } from '@/components/shared';
import type { FolgeWithId } from '@/models/folge';

import { GridFolge } from './components/GridFolge';
import { MultiRangeInput } from './components/MultiRangeInput';
import { Sort } from './components/Sort';
import { useFolgenWithUserRatings, useGridState } from './hooks';
import { useBackgroundSortTheme } from './hooks';
import { FolgenContainer, GridUI } from './StyledGrid';
import { applyFilter } from './utils/filter';

interface GridProps {
  folgen: FolgeWithId[];
  coverOnly?: boolean;
  withFilters?: boolean;
  withUi?: boolean;
}

const initialYearRange = {
  min: 1979,
  max: dayjs().year(),
};

export function Grid(props: GridProps) {
  const { coverOnly = false, withFilters = false, withUi = false } = props;
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useGridState();
  const [onlyUnrated, setOnlyUnrated] = useState(false);
  const { status } = useSession();

  const [yearRange, setYearRange] = useState(initialYearRange);

  const folgen = useFolgenWithUserRatings(props.folgen);

  useBackgroundSortTheme(sortBy, { enabled: withUi });

  const filteredFolgen = useMemo(() => {
    if (!withFilters) return folgen;
    return applyFilter(folgen, {
      showSpecials,
      searchQuery,
      sortBy,
      onlyUnrated,
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
    withFilters,
    yearRange,
    onlyUnrated,
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
      {withUi && (
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
                  checked={onlyUnrated}
                  label="Nicht bewerted"
                  onChange={setOnlyUnrated}
                />
              )}
              <Switch
                checked={showSpecials}
                label="Specials"
                onChange={setShowSpecials}
              />
            </div>
          </GridUI>

          <div className="mb-8">
            {filteredFolgen.length}{' '}
            {filteredFolgen.length === 1 ? 'Folge' : 'Folgen'}
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
              coverOnly={coverOnly}
            />
          ))}
        </FolgenContainer>
      )}
    </div>
  );
}
