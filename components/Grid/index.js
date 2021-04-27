import React, { useState, useEffect, useContext } from 'react';
import { GridContainer, GridUI, FolgenContainer } from './StyledGrid';
import dayjs from 'dayjs';

import Sort from '../Sort';
import GridFolge from './GridFolge';
import {
  sortFolgenByRating,
  sortFolgenByDateAsc,
  sortFolgenByDateDesc,
} from '../../utils';

import { GlobalContext } from '../../context/GlobalContext';
import Loader from '../Loader';

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
    }
  };

  useEffect(() => {
    const showRightFolgen = () => {
      let folgenToShow = [];

      folgenToShow = filterSpecial();
      folgenToShow = filterByQuery(folgenToShow);
      folgenToShow = applySort(folgenToShow);

      folgenToShow.forEach(f  => console.log(f.number))
      setFolgen(folgenToShow);
    };

    showRightFolgen();

    setBodyBgByStyle(sortBy);
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
        <Sort currentSort={sortBy} onSortChange={(by) => setSortBy(by)} />
        <div>
          <label>
            <span>Specials anzeigen</span>
            <input
              type="checkbox"
              checked={showSpecials}
              onChange={(e) => handleCheckboxChange(e)}
            />
          </label>
        </div>
        <div>{folgen.length} Folgen</div>
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
      style = '#001727';
  }

  document.body.style.background = style;
};

export default Grid;
