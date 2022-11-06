import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties, memo, useEffect, useRef } from 'react';

import CommunityRating from '@/components/CommunityRating';
import ListButton from '@/components/ListButton';
import { DATE_FORMAT } from '@/constants/formats';
import dayjs from '@/lib/dayjs';
import type { FolgeWithId } from '@/models/folge';

import Cover from './Cover';
import { FolgeContainer, RatingBadge } from './StyledFolge';

interface GridFolgeProps {
  folge: FolgeWithId;
  userRating?: number | null;
  coverOnly?: boolean;
  style?: CSSProperties;
}

const GridFolge = memo(
  ({
    folge,
    userRating = null,
    coverOnly = false,
    ...rest
  }: GridFolgeProps) => {
    const router = useRouter();
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (router.query.ref === folge._id) {
        ref.current?.scrollIntoView({ block: 'center' });
      }
    }, [router.query.ref, folge._id]);

    const href = '/folge/' + folge._id;
    // const href = `/folge/${folge.name.split(' ').join('-').toLowerCase()}`;

    return (
      <FolgeContainer ref={ref} {...rest}>
        <Link href={href} aria-label={folge.name}>
          <Cover
            images={folge.images}
            alt={`${folge.name} Cover`}
            coverOnly={coverOnly}
          />
        </Link>

        {!coverOnly && (
          <div className="bottom">
            <div>
              <CommunityRating
                numerOfRatings={folge.number_of_ratings}
                rating={folge.rating}
              />
              <div className="release">
                {dayjs(folge.release_date).format(DATE_FORMAT)}
              </div>
            </div>

            <div className="right">
              {userRating && <RatingBadge>{userRating}</RatingBadge>}
              <ListButton
                folgeId={folge._id.toString()}
                folgeName={folge.name}
              />
            </div>
          </div>
        )}
      </FolgeContainer>
    );
  },
);

export default GridFolge;
