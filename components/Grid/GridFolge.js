import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';
import { InView } from 'react-intersection-observer';

import { Loader } from '../Loader';
import RatingDisplay from '../RatingDisplay';
import { Cover, FolgeContainer, NewBadge } from './StyledFolge';

const GridFolge = React.memo(({ folge, coverOnly = false }) => {
  return (
    <FolgeContainer>
      <Link href={`/folge/${folge._id}`}>
        <a>
          <FolgeCover
            src={folge.images[1].url}
            alt={`${folge.name} Cover`}
            release_date={folge.release_date}
          />
        </a>
      </Link>
      {!coverOnly && (
        <div>
          <div>
            <RatingDisplay ratings={folge.ratings} />
          </div>
          <div>{dayjs(folge.release_date).format('DD.MM.YYYY')}</div>
        </div>
      )}
    </FolgeContainer>
  );
});

const FolgeCover = ({ src, alt, release_date }) => {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  const releaseDate = dayjs(release_date);
  const today = dayjs();

  const isNewerThanTwoMonth = releaseDate.add(2, 'month').isAfter(today);

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
        {isNewerThanTwoMonth && <NewBadge>neu</NewBadge>}
        {loading && <Loader />}
        <img
          style={{ display: loading ? 'none' : 'block' }}
          src={imgSrc}
          alt={alt}
          onLoad={() => setLoading(false)}
        />
      </Cover>
    </InView>
  );
};

export default React.memo(GridFolge);
