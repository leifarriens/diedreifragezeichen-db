import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { InView } from 'react-intersection-observer';
import Select from 'react-select';

import { sortDescendingByNumber, sortAscendingByNumber } from '../utils/index';

const Grid = () => {
  const [folgen, setFolgen] = useState([]);
  const [sortDirection, setSortDirection] = useState('descending');

  useEffect(() => {
    Axios('/api/folge')
    .then(response => {
      setFolgen(response.data);
    });
  }, []);

  // const sortData = () => {
  //   console.log(sortDirection);
  //   if (sortDirection == 'descending') {
  //     setFolgen(sortDescendingByNumber(folgen));
  //   }

  //   if (sortDirection == 'ascending') {
  //     setFolgen(sortAscendingByNumber(folgen));
  //   }
  // }

  // useEffect(() => {
  //   sortData();
  // }, [sortDirection]);

  // const handleSortDirectionChange = (e) => {
  //   setSortDirection(e.target.value);
  // }

  return (
    <div>
      <select 
        value={sortDirection} 
        // onChange={handleSortDirectionChange}
      >
        <option value="descending">descending</option>
        <option value="ascending">ascending</option>
      </select>
      <Search />
      <div className="folgen folgen_grid">
        {folgen.map(folge => <Folge key={folge._id} data={folge}/>)}
      </div>
    </div>
  );
}

const Folge = ({ data }) => {
  const [imgSrc, setImgSrc] = useState('');

  const handleViewChange = (inView) => {
    if (!inView) return;
    if (inView) fetchImage();
  }
  const fetchImage = () => {
    setImgSrc(data.images[1].url);
  }

  const imgIsLoad = () => {
    // console.log('loaded');
  }

  return (
    <InView as="div" onChange={(inView) => handleViewChange(inView)} className="folge-miniatur" data-aos="fade-up">
      <div className="folge-miniatur">
        <Link to={`/folge/${data._id}`}>
          <div className="cover">
            <img onLoad={imgIsLoad} src={imgSrc}/>
          </div>
        </Link>
      </div>
    </InView>
  );
}

export default Grid;