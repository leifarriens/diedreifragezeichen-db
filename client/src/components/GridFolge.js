import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import dayjs from 'dayjs';

import { calcFolgenRating } from '../utils';

import { Loader } from './Loader';

const GridFolge = ({ folge }) => {
  const rating = calcFolgenRating(folge.ratings);

  const rederRatingIcons = () => {
    const blues = rating;
    const whites = 10 - rating;
    const icons = [];
    for (let i = 0; i < blues; i++) {
      icons.push(<span key={i} className="icon blue">?</span>);
    }
    for (let i = 0; i < whites; i++) {
      icons.push(<span key={i} className="icon">?</span>);
    }
    return icons;
  }

  return (
    <div as="div" className="folge-miniatur">
      <Link to={`/folge/${folge._id}`}>
        <FolgeCover src={folge.images[1].url}/>
      </Link>
      <div className="description">
        <div className="folge-miniatur__rating">
          <div className="rating">
            {rederRatingIcons()}
          </div>
          <div>{rating.toFixed(1)}/<small>10</small></div>
        </div>
        <div>{dayjs(folge.release_date).format('DD.MM.YYYY')}</div>
      </div>
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

export default GridFolge;