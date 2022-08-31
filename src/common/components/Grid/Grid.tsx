import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { useGlobalState } from '@/context/GlobalContext';
import { FolgeType, Rating } from '@/types';
import { applyFilter } from '@/utils/filter';

import GridFolge from './GridFolge';
import Sort from './Sort';
import {
  FolgenContainer,
  FolgenCounter,
  GridContainer,
  GridUI,
} from './StyledGrid';

type GridProps = {
  folgen: FolgeType[];
  coverOnly?: boolean;
  withFilters?: boolean;
  withUi?: boolean;
};

import { getUserRatings } from '@/services/client';

import Switch from '../shared/Switch';

const Grid = (props: GridProps) => {
  const { data: session, status } = useSession();
  const { coverOnly = false, withFilters = false, withUi = false } = props;
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useGlobalState();

  const [folgen, setFolgen] = useState(props.folgen);

  useQuery([session?.user.id, 'ratings'], () => getUserRatings(), {
    enabled: status === 'authenticated' && !coverOnly,
    onSuccess: (data) => {
      const folgenWithUserRating = folgen.map((folge) => {
        const rating = data.find(
          (rating: Rating) => rating.folge === folge._id,
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
          <Sort currentSort={sortBy} onSortChange={(by) => setSortBy(by)} />
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
