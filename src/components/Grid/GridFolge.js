import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { InView } from 'react-intersection-observer';

import { Loader } from '../Loader';
import { Cover, FolgeContainer, RatingBadge } from './StyledFolge';

const GridFolge = React.memo(
  ({ folge, userRating = null, coverOnly = false, ...rest }) => {
    const [image, setImage] = useState({
      url: '',
      loading: true, // needs to be initial "true" to hide Image
    });
    const router = useRouter();
    const ref = React.useRef();
    // const href = `/folge/${folge.name.split(' ').join('-').toLowerCase()}`;

    useEffect(() => {
      if (router.query.ref === folge._id) {
        console.log(folge);
        ref.current.scrollIntoView();
      }
    }, []);

    const href = '/folge/' + folge._id;

    const handleViewChange = (inView) => {
      if (!inView) return;

      setImage({ url: folge.images[0].url, loading: true });
    };

    return (
      <>
        <FolgeContainer ref={ref} {...rest}>
          <Link href={href}>
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
                    onLoad={() =>
                      setImage((prev) => ({ ...prev, loading: false }))
                    }
                  />
                </Cover>
              </InView>

              {!coverOnly && (
                <div className="text">
                  <div>
                    <div>{folge.rating ? folge.rating : ' ??? '}/10</div>
                    <div style={{ fontSize: '0.8em' }}>
                      {dayjs(folge.release_date).format('DD.MM.YYYY')}
                    </div>
                  </div>
                  {userRating && <RatingBadge>{userRating}</RatingBadge>}
                </div>
              )}
            </a>
          </Link>
        </FolgeContainer>
      </>
    );
  }
);

export default React.memo(GridFolge);
