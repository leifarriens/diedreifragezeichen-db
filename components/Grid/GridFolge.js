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

const GridFolge = React.memo(({ folge, coverOnly = false }) => {
  const rating = calcFolgenRating(folge.ratings);

  return (
    <article style={{ width: '100%' }}>
      <Link href={`/folge/${folge._id}`}>
        <a>
          <FolgeCover src={folge.images[1].url} alt={`${folge.name} Cover`} />
        </a>
      </Link>
      {!coverOnly && (
        <div>
          <div>
            {rating ? rating : '???'}/<small>10</small>{' '}
          </div>
          <div>{dayjs(folge.release_date).format('DD.MM.YYYY')}</div>
        </div>
      )}
    </article>
  );
});

const FolgeCover = ({ src, alt }) => {
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
        {/* <Loader /> */}
        <img
          style={{
            display: loading ? 'none' : 'block',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          }}
          src={imgSrc}
          alt={alt}
          onLoad={() => setLoading(false)}
        />
      </Cover>
    </InView>
  );
};

export default GridFolge;
