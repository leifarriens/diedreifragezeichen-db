import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';

import ExpandableParagraph from '@/components/ExpandableParagraph';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { Textarea } from '@/components/shared/Input';
import { colors } from '@/constants/theme';
import { useUserRating } from '@/hooks';
import dayjs from '@/lib/dayjs';
import { RatingWithFolge } from '@/types';

import { userReviewsQueryKey } from '../hooks/useInfiniteUserReviews';

type UserReviewProps = {
  review: RatingWithFolge;
};

type FormValues = {
  value: number;
  body: string;
};

export default function UserReview({ review }: UserReviewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isExtendedHeight, setIsExtendedHeight] = useState<boolean>();
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      value: review.value,
      body: review.body,
    },
  });

  const { mutation } = useUserRating(review.folge._id.toString(), {
    onMutationSuccess: () => {
      reset();
      setIsEditing(false);
      if (session?.user.id) {
        queryClient.invalidateQueries(userReviewsQueryKey(session?.user.id));
      }
    },
  });

  useEffect(() => {
    if (ref.current) {
      setIsExtendedHeight(ref.current?.getBoundingClientRect().height > 220);
    }
  }, []);

  const style = {
    ...(isExtendedHeight && { borderBottomLeftRadius: '0' }),
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate({ folgeId: review.folge._id.toString(), ...data });
  };

  return (
    <StyledUserReview ref={ref}>
      <Link href={`/folge/${review.folge._id.toString()}`}>
        <a>
          <img src={review.folge.images[1].url} alt="" style={style} />
        </a>
      </Link>
      <div className="content">
        <header>
          <h3>{review.folge.name}</h3>
          <span>{dayjs(review.updated_at).fromNow()}</span>
        </header>

        {!isEditing ? (
          <>
            <div>{review.value.toFixed(1)}</div>
            <ExpandableParagraph text={review.body} previewLength={256} />
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="number"
              min={1}
              max={10}
              step={0.5}
              {...register('value', { required: true, valueAsNumber: true })}
            />
            <Textarea {...register('body', { required: true })} />
            <div className="right">
              <Button type="submit" color={colors.lightblue} size="small">
                Speichern
              </Button>
            </div>
          </form>
        )}

        {session?.user.id === review.user.toString() && (
          <div className="right">
            <button onClick={() => setIsEditing((curr) => !curr)}>
              {!isEditing ? <AiFillEdit /> : <AiOutlineClose />}
            </button>
          </div>
        )}
      </div>
    </StyledUserReview>
  );
}

const StyledUserReview = styled(Card)`
  padding: 0;

  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: flex-start;

  img {
    display: block;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .content {
    padding: 2em;

    h3 {
      margin-bottom: 0;
    }

    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5em;

      span {
        display: block;
        font-size: 0.8em;
        color: ${colors.gray};
        /* margin-bottom: 0.5em; */
      }
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
  }
`;
