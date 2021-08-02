import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../context/GlobalContext';
import { applyFilter } from '../../utils';
import Sort from '../Sort';
import GridFolge from './GridFolge';
import { FolgenContainer, GridContainer, GridUI } from './StyledGrid';

const Grid = (props) => {
  const {
    searchQuery,
    sortBy,
    setSortBy,
    showSpecials,
    setShowSpecials,
  } = useContext(GlobalContext);

  const [folgen, setFolgen] = useState(props.folgen);

  useEffect(() => {
    const showRightFolgen = () => {
      const folgenToShow = applyFilter(props.folgen, {
        showSpecials,
        searchQuery,
        sortBy,
      });
      
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
