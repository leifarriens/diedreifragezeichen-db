import styled from 'styled-components';

import ExpandableParagraph from '@/components/ExpandableParagraph';
import Avatar from '@/components/shared/Avatar';
import { colors } from '@/constants/theme';
import dayjs from '@/lib/dayjs';
import { ReviewWithUser } from '@/types';

type ReviewProps = ReviewWithUser & {
  isUsers: boolean;
};

export const FolgenReview = ({
  user,
  updated_at,
  value,
  body,
}: ReviewProps) => {
  return (
    <StyledReview>
      <Avatar image={user.image} name={user.name} />

      <div>
        <header>
          <div>
            <span className="name">{user.name}</span>
            <span className="date">{dayjs(updated_at).fromNow()}</span>
          </div>

          <span className="value">{value.toFixed(1)}</span>
        </header>

        <ExpandableParagraph text={body} previewLength={1024} />
      </div>
    </StyledReview>
  );
};

export const StyledReview = styled.article`
  font-size: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  column-gap: 1em;
  margin-bottom: 2em;

  header {
    display: grid;
    justify-items: start;
    grid-template-columns: 1fr auto;
    margin-bottom: 0.65em;

    .name {
      margin-right: 0.5ch;
    }

    .date {
      font-size: 0.8em;
      color: ${colors.gray};
    }

    .value {
      line-height: 1;
      font-size: 1.45em;
    }
  }

  footer {
    text-align: right;
  }
`;
