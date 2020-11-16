import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import Miniatur from './Miniatur';

const Container = styled.div`
  display: grid;
  grid-gap: 24px;
  padding: 0 24px;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
`;

import { sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../../utils';

const Grid = (props) => {
  const [queryFilter, setQueryFilter] = useState('');
  const [folgen, setFolgen] = useState([]);
  const [sortBy, setSortBy] = useState('');

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

  return (
    <Container>
      {/* <GridUI>
        <Search onQuery={setQueryFilter}/>
        <Sort onSortChange={(by) => setSortBy(by)}/>
        <div>{folgen.length} Folgen</div>        
      </GridUI> */}

      {folgen.map(folge => <Miniatur key={folge._id} folge={folge}/>)}
    </Container>
  );
}

export default Grid;