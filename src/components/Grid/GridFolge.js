import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';
import { InView } from 'react-intersection-observer';

import { Loader } from '../Loader';
import RatingDisplay from '../RatingDisplay';
import { Cover, FolgeContainer, NewBadge } from './StyledFolge';

const GridFolge = React.memo(({ folge, coverOnly = false }) => {
  const [image, setImage] = useState({
    url: '',
    loading: true, // needs to be initial "true" to hide Image
  });

  const releaseDate = dayjs(folge.release_date);
  const today = dayjs();
  const isNew = releaseDate.add(2, 'month').isAfter(today);

  const handleViewChange = (inView) => {
    if (!inView) return;
    if (inView) setImage({ url: folge.images[1].url, loading: true });
  };

  return (
    <FolgeContainer>
      <Link href={`/folge/${folge._id}`}>
        <a>
          <InView as="div" onChange={handleViewChange} triggerOnce={true}>
            {!coverOnly && (
              <>
                <FolgeContainer.Background />
                <FolgeContainer.Overlay
                  style={{ backgroundImage: `url(${image.url})` }}
                />
              </>
            )}
            <Cover>
              {image.loading && <Loader />}
              <img
                style={{ display: image.loading ? 'none' : 'block' }}
                src={image.url}
                alt={`${folge.name} Cover`}
                onLoad={() => setImage((prev) => ({ ...prev, loading: false }))}
              />
            </Cover>
          </InView>

          {!coverOnly && (
            <div className="text">
              <div>
                <div>
                  <RatingDisplay rating={folge.rating} />
                </div>
                <div style={{ fontSize: '0.8em' }}>
                  {dayjs(folge.release_date).format('DD.MM.YYYY')}
                </div>
              </div>
              <div>
                {folge.userRating && (
                  <div>Deine Wertung: {folge.userRating}</div>
                )}
                {isNew && <NewBadge>neu</NewBadge>}
              </div>
            </div>
          )}
        </a>
      </Link>
    </FolgeContainer>
  );
});

export default React.memo(GridFolge);
