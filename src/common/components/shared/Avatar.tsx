import classnames from 'classnames';
import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

type AvatarProps = {
  image: string | null;
  name: string;
  userId?: string;
};

/**
 * Passing `userId` results in the Avatar being a clickable link to the users profile
 */
const Avatar = ({ image, name, userId }: AvatarProps) => {
  const src = !image ? '/white_small.png' : image;

  const avatar = (
    <StyledAvatar
      src={src}
      referrerPolicy="no-referrer"
      className={classnames({ placeholder: !image })}
      alt={`${name} Avatar`}
    />
  );

  return (
    <Container>
      {!userId ? (
        avatar
      ) : (
        <Link href={`/user/${userId}`}>
          <a>{avatar}</a>
        </Link>
      )}
    </Container>
  );
};

const Container = styled.div`
  a {
    display: block;
    border-radius: 50%;
  }
`;

const StyledAvatar = styled.img`
  width: 2.6em;
  max-height: 2.6em;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 50%);

  &.placeholder {
    object-fit: contain;
    padding: 0.5em;
    background-color: ${colors.darkblue};
  }
`;

export default Avatar;
