import { Session } from 'next-auth';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import RatingInput from '@/components/RatingInput';
import Avatar from '@/components/shared/Avatar';
import Button from '@/components/shared/Button';
import { FieldError, Textarea } from '@/components/shared/Input';
import { colors } from '@/constants/theme';
import { useUserRating } from '@/hooks';

import { folgenReviewsQueryKey } from '../hooks/useInfiniteFolgenReviews';
import { StyledReview } from './FolgenReview';

type ReviewFormProps = {
  folgeId: string;
  user: Session['user'];
};

type ReviewFormValues = {
  value: number;
  body: string;
};

export const ReviewForm = ({ folgeId, user }: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const { mutation, rating } = useUserRating(folgeId, {
    onMutationSuccess() {
      queryClient.invalidateQueries(folgenReviewsQueryKey(folgeId));
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ReviewFormValues>({ mode: 'all' });

  const isEmpty = Object.values(watch()).every((value) => !value);

  const body = watch('body');

  const onSubmit: SubmitHandler<ReviewFormValues> = (data) => {
    mutation.mutate({ folgeId, ...data });
    reset();
  };

  useEffect(() => reset(), [folgeId, reset]);

  if (rating.isFetching || rating.data?.body) return null;

  return (
    <StyledReview>
      <Avatar image={user.image} name={user.name} />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="value"
            defaultValue={rating.data?.value}
            shouldUnregister={true}
            rules={{
              required:
                'Du musst eine Wertung abgeben um ein Review zu verfassen!',
            }}
            render={({ field: { onChange, value } }) => (
              <RatingInput
                height="35px"
                defaultValue={value}
                onRate={onChange}
              />
            )}
          />
          {!isEmpty && errors['value'] && (
            <FieldError>{errors.value.message}</FieldError>
          )}
          <Textarea
            placeholder="Review verfassen..."
            spellCheck
            minHeight="120px"
            {...register('body', { required: true })}
          />
          <footer>
            <Button
              type="submit"
              color={colors.lightblue}
              disabled={!body || mutation.isLoading}
            >
              Speichern
            </Button>
          </footer>
        </form>
      </div>
    </StyledReview>
  );
};
