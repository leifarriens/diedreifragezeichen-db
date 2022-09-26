import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { useGlobalState } from '@/context/GlobalContext';
import { Folge } from '@/models/folge';
import { Rating } from '@/models/rating';
import { getUserRatings } from '@/services/client';
import { applyFilter } from '@/utils/filter';

import Switch from '../shared/Switch';
import GridFolge from './GridFolge';
import Sort from './Sort';
import {
  FolgenContainer,
  FolgenCounter,
  GridContainer,
  GridUI,
} from './StyledGrid';

type GridProps = {
  folgen: Folge[];
  coverOnly?: boolean;
  withFilters?: boolean;
  withUi?: boolean;
};

const Grid = (props: GridProps) => {
  const { data: session, status } = useSession();
  const { coverOnly = false, withFilters = false, withUi = false } = props;
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useGlobalState();

  const [folgen, setFolgen] = useState(props.folgen);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSpecials(e.target.checked);
  };

  const filteredFolgen = useMemo(() => {
    if (!withFilters) return folgen;
    return applyFilter(folgen, {
      showSpecials,
      searchQuery,
      sortBy,
    });
  }, [folgen, showSpecials, searchQuery, sortBy, withFilters]);

  return (
    <GridContainer>
      {withUi && (
        <GridUI>
          <Sort currentSort={sortBy} onSortChange={setSortBy} />
          <Switch
            id="confirm"
            checked={showSpecials}
            onChange={handleCheckboxChange}
          />
          <FolgenCounter>
            <span>
              {filteredFolgen.length}{' '}
              {filteredFolgen.length === 1 ? 'Folge' : 'Folgen'}
            </span>
          </FolgenCounter>
        </GridUI>
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
