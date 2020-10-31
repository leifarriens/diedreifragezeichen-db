import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import Axios from 'axios';
import dayjs from 'dayjs';

import Search from './Search';
import { FullpageLoader } from './Loader';
import { Loader } from '../components/Loader';
import Rate from './Rate';
import { calcFolgenRating, sortFolgenByRating, sortFolgenByDateAsc, sortFolgenByDateDesc } from '../utils';

const Grid = () => {
  const [alleFolgen, setAlleFolgen] = useState([]);
  const [queryFilter, setQueryFilter] = useState('');
  const [folgen, setFolgen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllFolgen();
  }, []);

  useEffect(() => {
    const filterFolge = (folge) => {
      const query = queryFilter.toLowerCase();
      const name = folge.name.toLowerCase();
      return name.includes(query);
    }
    let filtered = alleFolgen.filter(filterFolge);
    setFolgen(filtered);
  }, [queryFilter]);

  const getAllFolgen = () => {
    Axios('/api/folge')
    .then(response => {
      setAlleFolgen(response.data);
      setFolgen(response.data);
      console.log(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
      setError(error);
    });
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
      <div>
        {folgen.length} Folgen
      </div>
      {loading && <FullpageLoader />}
      <div className="folgen folgen_grid">
        {folgen.map(folge => <Folge key={folge._id} data={folge}/>)}
      </div>
    </div>
  );
}

const Folge = ({ data }) => {
  const rating = calcFolgenRating(data.ratings);

  const rederRatingIcons = () => {
    const blues = rating;
    const whites = 10 - rating;
    const icons = [];
    for (let i = 0; i < blues; i++) {
      icons.push(<span className="icon blue">?</span>);
    }
    for (let i = 0; i < whites; i++) {
      icons.push(<span className="icon">?</span>);
    }
    console.log(icons);
    return icons;
  }

  return (
    <div as="div" className="folge-miniatur">
      <Link to={`/folge/${data._id}`}>
        <FolgeCover src={data.images[1].url}/>
      </Link>
      {/* <div><Rate folgen_id={data._id} currentRating={rating}/></div> */}
      {/* {rating.map(x => <span className="icon">?</span>)} */}
      <div className="rating">
        {rederRatingIcons()}
      </div>
      <div>{rating.toFixed(1)}/<small>10</small></div>
      <div>{dayjs(data.release_date).format('DD.MM.YYYY')}</div>
    </div>
  );
}

const FolgeCover = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  const handleViewChange = (inView) => {
    if (!inView) return;
    if (inView) setImgSrc(src);
  }

  return (
    <InView as="div" onChange={(inView) => handleViewChange(inView)} className="cover">
      {loading && <Loader />}
      <img style={{ display: loading ? 'none': 'block' }} src={imgSrc} onLoad={() => setLoading(false)}/>
    </InView>
  );
}

export default Grid;