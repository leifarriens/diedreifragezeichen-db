import React, { useState } from 'react';
import Link from 'next/link';
import { InView } from 'react-intersection-observer';
import dayjs from 'dayjs';

import { calcFolgenRating } from '../../utils';

import { Loader } from '../Loader';
import styled from 'styled-components';

const Cover = styled.div`
  width: 100%;
  height: auto;
  transition: transform 150ms ease;
  transform-origin: bottom;

  :hover {
    transform: scale(1.05);
  }

  @media (pointer: coarse) {
    :hover {
      transform: none;
    }
  }
`;

const GridFolge = React.memo(({ folge }) => {
  const rating = calcFolgenRating(folge.ratings);

  return (
    <div className="folge-miniatur">
      <Link href={`/folge/${folge._id}`}>
        <a>
          <FolgeCover src={folge.images[1].url} />
        </a>
      </Link>
      <div className="description">
        <div className="folge-miniatur__rating">
          <div>
            {rating.toFixed(1)}/<small>10</small>
          </div>
        </div>
        <div>{dayjs(folge.release_date).format('DD.MM.YYYY')}</div>
      </div>
    </div>
  );
});

const FolgeCover = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  const handleViewChange = (inView) => {
    if (!inView) return;
    if (inView) setImgSrc(src);
  };

  return (
    <InView
      as="div"
      onChange={(inView) => handleViewChange(inView)}
      triggerOnce={true}
    >
      <Cover>
        {loading && <Loader />}
        <img
          style={{ display: loading ? 'none' : 'block' }}
          src={imgSrc}
          onLoad={() => setLoading(false)}
        />
      </Cover>
    </InView>
  );
};

export default GridFolge;
