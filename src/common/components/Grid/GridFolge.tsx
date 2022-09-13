/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';

import dayjs from '@/lib/dayjs';
import type { Folge } from '@/models/folge';

import CommunityRating from '../CommunityRating';
import ListButton from '../ListButton';
import { Loader } from '../shared/Loader';
import {
  Background,
  Cover,
  FolgeContainer,
  Overlay,
  RatingBadge,
} from './StyledFolge';

interface GridFolgeProps {
  folge: Folge;
  userRating?: number | null;
  coverOnly?: boolean;
  style?: CSSProperties;
}

const GridFolge = React.memo(
  ({
    folge,
    userRating = null,
    coverOnly = false,
    ...rest
  }: GridFolgeProps) => {
    const [image, setImage] = useState({
      url: '',
      loading: true, // needs to be initial "true" to hide Image
    });
    const router = useRouter();
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (router.query.ref === folge._id) {
        ref.current?.scrollIntoView({ block: 'center' });
      }
    }, [router.query.ref, folge._id]);

    const href = '/folge/' + folge._id;
    // const href = `/folge/${folge.name.split(' ').join('-').toLowerCase()}`;

    const handleViewChange = (inView: boolean) => {
      if (!inView) return;

      setImage({ url: folge.images[1].url, loading: true });
    };

    return (
      <FolgeContainer ref={ref} {...rest}>
        <Link href={href}>
          <a>
            <InView as="div" onChange={handleViewChange} triggerOnce={true}>
              {!coverOnly && (
                <>
                  <Background />
                  <Overlay style={{ backgroundImage: `url(${image.url})` }} />
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
          </a>
        </Link>

        {!coverOnly && (
          <div className="bottom">
            <div>
              <CommunityRating
                numerOfRatings={folge.number_of_community_ratings}
                rating={folge.community_rating}
              />
              <div className="release">
                {dayjs(folge.release_date).format('DD.MM.YYYY')}
              </div>
            </div>

            <div className="right">
              {userRating && (
                <Link href={href}>
                  <a>
                    <RatingBadge>{userRating}</RatingBadge>
                  </a>
                </Link>
              )}
              <ListButton folgeId={folge._id} folgeName={folge.name} />
            </div>
          </div>
        )}
      </FolgeContainer>
    );
  },
);

export default React.memo(GridFolge);
