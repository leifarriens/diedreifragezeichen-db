import React, { useState, useEffect, Suspense } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';

import Search from './Search';
import { FullpageLoader } from './Loader';
import Sort from './Sort';
import GridFolge from './GridFolge';
import { sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../utils';

const Grid = (props) => {
  const [queryFilter, setQueryFilter] = useState('');
  const [folgen, setFolgen] = useState([]);

  useEffect(() => {
    console.log(props.folgen);
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

  const sortBy = (by) => {
    console.log(by);
    switch (by) {
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
  }

  const sortByRating = () => setFolgen(sortFolgenByRating);

  const sortOldest = () => setFolgen(sortFolgenByDateAsc);

  const sortNewest = () => setFolgen(sortFolgenByDateDesc);

  return (
    <div className="grid-wrapper">
      <Search onQuery={setQueryFilter}/>
      <div>
        <button className="button" onClick={sortNewest}>Neuste Zuerst</button>
        <button className="button" onClick={sortOldest}>Älteste Zuerst</button>
        <button className="button" onClick={sortByRating}>Beste zuerst</button>
      </div>
      <Sort onSortChange={sortBy}/>
      <div>
        {folgen.length} Folgen
      </div>
      {/* {loading && <FullpageLoader />} */}
      <div className="grid folgen folgen_grid">
        {folgen.map(folge => <GridFolge key={folge._id} folge={folge}/>)}
      </div>
    </div>
  );
}

export default Grid;