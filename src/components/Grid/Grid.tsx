import React, { useContext, useEffect, useState } from 'react';
import { FolgeType } from 'src/types';

import { GlobalContext } from '../../context/GlobalContext';
import { applyFilter } from '../../utils';
import Sort from '../Sort';
import GridFolge from './GridFolge';
import {
  FolgenContainer,
  FolgenCounter,
  GridContainer,
  GridUI,
} from './StyledGrid';

type GridProps = {
  folgen: FolgeType[];
};

const Grid = (props: GridProps) => {
  const { searchQuery, sortBy, setSortBy, showSpecials, setShowSpecials } =
    useContext(GlobalContext);

  const [folgen, setFolgen] = useState(props.folgen);

  useEffect(() => {
    setFolgen(
      applyFilter(props.folgen, {
        showSpecials,
        searchQuery,
        sortBy,
      })
    );

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) setBodyBgByStyle(sortBy);

    return () => {
      unsetBodyBgStyle();
    };
  }, [showSpecials, searchQuery, sortBy]);

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
    'container'
  )[0] as HTMLElement;

  container.style.background = style;
};

const unsetBodyBgStyle = () => {
  const container = document.getElementsByClassName(
    'container'
  )[0] as HTMLElement;

  container.style.removeProperty('background');
};

export default Grid;
