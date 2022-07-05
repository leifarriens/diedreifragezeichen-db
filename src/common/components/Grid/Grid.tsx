import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { GlobalContext } from '@/context/GlobalContext';
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
};
import { getUserRatings } from '@/services/client';

const Grid = (props: GridProps) => {
  const { data: session, status } = useSession();
  const { coverOnly = false } = props;
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useContext(GlobalContext);

  const [folgen, setFolgen] = useState(props.folgen);

  useEffect(() => {
    setFolgen(
      applyFilter(props.folgen, {
        showSpecials,
        searchQuery,
        sortBy,
      }),
    );

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) setBodyBgByStyle(sortBy);

    return () => {
      unsetBodyBgStyle();
    };
  }, [showSpecials, searchQuery, sortBy, props.folgen]);

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

  return (
    <GridContainer>
      <GridUI>
        <Sort currentSort={sortBy} onSortChange={(by) => setSortBy(by)} />
        <span>
          <input
            id="confirm"
            type="checkbox"
            checked={showSpecials}
            onChange={(e) => handleCheckboxChange(e)}
          />
          <label htmlFor="confirm">Specials anzeigen</label>
        </span>
        <FolgenCounter>
          <span>
            {folgen.length} {folgen.length === 1 ? 'Folge' : 'Folgen'}
          </span>
        </FolgenCounter>
      </GridUI>

      <FolgenContainer>
        {folgen.map((folge) => (
          <GridFolge
            key={folge._id.toString()}
            folge={folge}
            userRating={folge.user_rating}
            coverOnly={coverOnly}
          />
        ))}
      </FolgenContainer>
    </GridContainer>
  );
};

const setBodyBgByStyle = (sortBy: string) => {
  let style = '';

  switch (sortBy) {
    case 'dateAsc':
      style = 'linear-gradient(0deg, #030f1a 0%, #001727 50%, #05182a 100%)';
      break;
    case 'dateDesc':
      style = 'linear-gradient(180deg, #030f1a 0%, #001727 50%, #05182a 100%)';
      break;
    default:
      style = '';
  }

  const container = document.getElementsByClassName(
    'container',
  )[0] as HTMLElement;

  container.style.background = style;
};

const unsetBodyBgStyle = () => {
  const container = document.getElementsByClassName(
    'container',
  )[0] as HTMLElement;

  container.style.removeProperty('background');
};

export default Grid;
