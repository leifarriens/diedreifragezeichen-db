/* eslint-disable @next/next/no-img-element */
import classnames from 'classnames';
import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

type ProfileLinkProps = {
  image: string | null;
};

function ProfileLink({ image }: ProfileLinkProps) {
  const src = !image ? '/white_small.png' : image;

  return (
    <Link href="/profil" passHref>
      <Container>
        <Avatar
          src={src}
          referrerPolicy="no-referrer"
          className={classnames({ placeholder: !image })}
          alt=""
        />
      </Container>
    </Link>
  );
}

const Container = styled.a`
  display: block;
  width: 2.6em;
  height: 2.6em;
  border-radius: 50%;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 50%);

  &.placeholder {
    object-fit: contain;
    padding: 0.5em;
    background-color: ${colors.gray};
  }
`;

export default ProfileLink;
