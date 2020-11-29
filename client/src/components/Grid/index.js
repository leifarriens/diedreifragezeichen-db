import React, { useState, useEffect, useContext } from 'react';
import { GridContainer, FolgenContainer } from './StyledGrid';

// import Search from './Search';
import Sort from '../Sort';
import GridFolge from './GridFolge';
import { sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../../utils';

import { GlobalContext } from '../../context/GlobalContext';

const Grid = (props) => {
  // const [queryFilter, setQueryFilter] = useState('');
  const { searchQuery } = useContext(GlobalContext);
  const [folgen, setFolgen] = useState([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    console.log(searchQuery);
    const filterFolge = (folge) => {
      const query = searchQuery.toLowerCase();
      const name = folge.number + folge.name.toLowerCase();
      return name.includes(query);
    }
    let filtered = props.folgen.filter(filterFolge);
    console.log(filtered);

    setFolgen(filtered);
  }, [searchQuery]);

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

  return (
    <GridContainer sortBy={sortBy}>
      <Sort onSortChange={(by) => setSortBy(by)}/>
      
      <FolgenContainer>
        {folgen.map(folge => <GridFolge key={folge._id} folge={folge}/>)}
      </FolgenContainer>
      
    </GridContainer>
  );
}

export default Grid;