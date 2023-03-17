import Link from 'next/link';
import { useRouter } from 'next/router';
import type { CSSProperties } from 'react';
import { memo, useEffect, useRef } from 'react';

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

const GridFolge = memo(function GridFolge({
  folge,
  userRating = null,
  coverOnly = false,
  ...rest
}: GridFolgeProps) {
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
        <div className="flex items-center justify-between py-2 px-3 text-sm">
          <div>
            <CommunityRating
              numerOfRatings={folge.number_of_ratings}
              rating={folge.rating}
            />
            <div className="text-xs font-extralight text-neutral-200">
              {dayjs(folge.release_date).format(DATE_FORMAT)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRating && <RatingBadge>{userRating}</RatingBadge>}
            <ListButton folgeId={folge._id} folgeName={folge.name} />
          </div>
        </div>
      )}
    </FolgeContainer>
  );
});

export default GridFolge;
