import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import Switch from '@/components/shared/Switch';
import type { FolgeWithId } from '@/models/folge';
import { Rating } from '@/models/rating';
import { getUserRatings } from '@/services/client';

import GridFolge from './components/GridFolge/GridFolge';
import MultiRangeInput from './components/MultiRangeInput';
import Sort from './components/Sort';
import { useGridState } from './hooks';
import { useBackgroundSortTheme } from './hooks';
import {
  FolgenContainer,
  FolgenCounter,
  GridContainer,
  GridUI,
} from './StyledGrid';
import { applyFilter } from './utils/filter';

type GridProps = {
  folgen: FolgeWithId[];
  coverOnly?: boolean;
  withFilters?: boolean;
  withUi?: boolean;
};

const initialYearRange = {
  min: 1979,
  max: dayjs().year(),
};

const Grid = (props: GridProps) => {
  const { data: session, status } = useSession();
  const { coverOnly = false, withFilters = false, withUi = false } = props;
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useGridState();

  const [yearRange, setYearRange] = useState(initialYearRange);

  const [folgen, setFolgen] = useState(props.folgen);

  useBackgroundSortTheme(sortBy, { enabled: withUi });

  useQuery([session?.user.id, 'ratings'], () => getUserRatings(), {
    enabled: status === 'authenticated' && !coverOnly,
    onSuccess: (ratings) => {
      const folgenWithUserRating = folgen.map((folge) => {
        const rating = ratings.find(
          (rating: Rating) => rating.folge == folge._id,
        );

        if (rating) {
          folge.user_rating = rating.value;
        }

        return folge;
      });

      setFolgen(folgenWithUserRating);
    },
  });

  const filteredFolgen = useMemo(() => {
    if (!withFilters) return folgen;
    return applyFilter(folgen, {
      showSpecials,
      searchQuery,
      sortBy,
      yearRange: {
        min: dayjs().year(yearRange.min).toDate(),
        max: dayjs().year(yearRange.max).toDate(),
      },
    });
  }, [folgen, showSpecials, searchQuery, sortBy, withFilters, yearRange]);

  useEffect(() => {
    if (
      yearRange.min !== initialYearRange.min ||
      yearRange.max !== initialYearRange.max
    ) {
      window.scrollTo({ top: 0 });
    }
  }, [yearRange]);

  return (
    <GridContainer>
      {withUi && (
        <>
          <GridUI>
            <Sort currentSort={sortBy} onSortChange={setSortBy} />

            <MultiRangeInput
              min={1979}
              max={dayjs().year()}
              onChange={setYearRange}
            />

            <Switch
              id="specials"
              checked={showSpecials}
              label="Specials anzeigen"
              onChange={setShowSpecials}
            />
          </GridUI>

          <FolgenCounter>
            <span>
              {filteredFolgen.length}{' '}
              {filteredFolgen.length === 1 ? 'Folge' : 'Folgen'}
            </span>
          </FolgenCounter>
        </>
      )}

      {props.folgen && props.folgen.length > 0 && (
        <FolgenContainer>
          {filteredFolgen.map((folge) => (
            <GridFolge
              key={folge._id.toString()}
              folge={folge}
              userRating={folge.user_rating}
              coverOnly={coverOnly}
            />
          ))}
        </FolgenContainer>
      )}
    </GridContainer>
  );
};

export default Grid;
