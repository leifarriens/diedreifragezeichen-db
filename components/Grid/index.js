import React, { useState, useEffect, useContext } from 'react';
import { GridContainer, GridUI, FolgenContainer } from './StyledGrid';
import dayjs from 'dayjs';

import Sort from '../Sort';
import GridFolge from './GridFolge';
import {
  sortFolgenByRating,
  sortFolgenByDateAsc,
  sortFolgenByDateDesc,
  sortByPopularity,
} from '../../utils';

import { GlobalContext } from '../../context/GlobalContext';

const Grid = (props) => {
  const {
    searchQuery,
    sortBy,
    setSortBy,
    showSpecials,
    setShowSpecials,
  } = useContext(GlobalContext);

  const [folgen, setFolgen] = useState(props.folgen);

  const filterSpecial = () => {
    return !showSpecials
      ? props.folgen.filter((folge) => folge.type !== 'special')
      : props.folgen;
  };

  const filterByQuery = (folgen) => {
    const query = searchQuery.toLowerCase();
    const filterFolge = (folge) => {
      const name = folge.number + folge.name.toLowerCase();

      if (name.includes(query)) {
        return true;
      } else if (dayjs(folge.release_date).year() == query) {
        return true;
      } else {
        return false;
      }
    };
    return folgen.filter(filterFolge);
  };

  const applySort = (folgen) => {
    switch (sortBy) {
      case 'dateAsc':
        return sortFolgenByDateAsc(folgen);
      case 'dateDesc':
        return sortFolgenByDateDesc(folgen);
      case 'rating':
        return sortFolgenByRating(folgen);
      case 'popularity':
        return sortByPopularity(folgen);
    }
  };

  useEffect(() => {
    const showRightFolgen = () => {
      let folgenToShow = [];

      folgenToShow = filterSpecial();
      folgenToShow = filterByQuery(folgenToShow);
      folgenToShow = applySort(folgenToShow);

      setFolgen(folgenToShow);
    };

    showRightFolgen();

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) setBodyBgByStyle(sortBy);

    return () => {
      unsetBodyBgStyle();
    };
  }, [showSpecials, searchQuery, sortBy]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setShowSpecials(true);
    } else {
      setShowSpecials(false);
    }
  };

  return (
    <GridContainer>
      <GridUI>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Sort currentSort={sortBy} onSortChange={(by) => setSortBy(by)} />
          <span style={{ marginBottom: '16px' }}>
            <input
              id="confirm"
              type="checkbox"
              checked={showSpecials}
              onChange={(e) => handleCheckboxChange(e)}
            />
            <label htmlFor="confirm">Specials anzeigen</label>
          </span>
        </div>
        <div>
          {folgen.length} {folgen.length === 1 ? 'Folge' : 'Folgen'}
        </div>
      </GridUI>

      <FolgenContainer>
        {folgen.map((folge) => (
          <GridFolge key={folge._id} folge={folge} />
        ))}
      </FolgenContainer>
    </GridContainer>
  );
};

const setBodyBgByStyle = (sortBy) => {
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

  document.getElementsByClassName('container')[0].style.background = style;
};

const unsetBodyBgStyle = () => {
  document
    .getElementsByClassName('container')[0]
    .style.removeProperty('background');
};

export default Grid;
