import React, { useState, useEffect, useContext } from 'react';
import { GridContainer, FolgenContainer } from './StyledGrid';

import Sort from '../Sort';
import GridFolge from './GridFolge';
import { sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../../utils';

import { GlobalContext } from '../../context/GlobalContext';

const Grid = (props) => {
  const { searchQuery } = useContext(GlobalContext);
  const [folgen, setFolgen] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  // const [showSpecials, setShowSpecials] = useState(false);

  useEffect(() => {
    const filterFolge = (folge) => {
      const query = searchQuery.toLowerCase();
      const name = folge.number + folge.name.toLowerCase();
      return name.includes(query);
    }
    let filtered = props.folgen.filter(filterFolge);

    setFolgen(filtered);
  }, [searchQuery]);

  // useEffect(() => {
  //   if (!showSpecials) {
  //     let filtered = props.folgen.filter(folge => {
  //       return folge.type !== 'special';
  //     });
  //     setFolgen(filtered);
  //   } else {
  //     setFolgen(props.folgen);
  //   }
  // }, [showSpecials]);

  useEffect(() => {
    switch (sortBy) {
      case 'dateAsc':
        setFolgen(sortFolgenByDateAsc);
        break;
      case 'dateDesc':
        setFolgen(sortFolgenByDateDesc);
        break;
      case 'rating':
        setFolgen(sortFolgenByRating);
        break;
    }
  }, [sortBy]);

  // const handleCheckboxChange = (e) => {
  //   const isChecked = e.target.checked;
  //   if (isChecked) {
  //     setShowSpecials(true);
  //   } else {
  //     setShowSpecials(false);
  //   }
  // }

  return (
    <GridContainer sortBy={sortBy}>
      <Sort onSortChange={(by) => setSortBy(by)}/>
      {/* <div>
        <label>
          <span>Specials anzeigen</span>
          <input type="checkbox" onChange={(e) => handleCheckboxChange(e)}/>
        </label>
      </div> */}
      
      <FolgenContainer>
        {folgen.map(folge => <GridFolge key={folge._id} folge={folge}/>)}
      </FolgenContainer>
      
    </GridContainer>
  );
}

export default Grid;