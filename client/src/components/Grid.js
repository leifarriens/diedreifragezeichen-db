import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Search from './Search';
import Sort from './Sort';
import GridFolge from './GridFolge';
import { sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../utils';


const GridContainer = styled.div`
  margin: 48px 0;
  /* padding: 0 12px; */
`;

const GridUI = styled.div`
  padding: 0 36px;
  // width: 300px;

  // @media (max-width: 768px) {
  //   width: 100%;
  // }
`;

const Grid = (props) => {
  const [queryFilter, setQueryFilter] = useState('');
  const [folgen, setFolgen] = useState([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
  }, [props.folgen]);

  useEffect(() => {
    const filterFolge = (folge) => {
      const query = queryFilter.toLowerCase();
      const name = folge.raw_name.toLowerCase();
      return name.includes(query);
    }
    let filtered = props.folgen.filter(filterFolge);

    setFolgen(filtered);
  }, [queryFilter]);

  useEffect(() => {
    switch (sortBy) {
      case 'dateAsc':
        setFolgen(sortFolgenByDateAsc)
        break;
      case 'dateDesc':
        setFolgen(sortFolgenByDateDesc)
        break;
      case 'rating':
        setFolgen(sortFolgenByRating)
        break;
    }
  }, [sortBy]);

  // const sortByRating = () => setFolgen(sortFolgenByRating);

  // const sortOldest = () => setFolgen(sortFolgenByDateAsc);

  // const sortNewest = () => setFolgen(sortFolgenByDateDesc);

  return (
    <GridContainer>
      <GridUI>
        <Search onQuery={setQueryFilter}/>
        <Sort onSortChange={(by) => setSortBy(by)}/>
        <div>{folgen.length} Folgen</div>        
      </GridUI>

      <div className="grid">
        {folgen.map(folge => <GridFolge key={folge._id} folge={folge}/>)}
      </div>
    </GridContainer>
  );
}

export default Grid;