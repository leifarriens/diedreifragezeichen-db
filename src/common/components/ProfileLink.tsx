import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

import Avatar from './shared/Avatar';

type ProfileLinkProps = {
  image: string | null;
  name: string;
};

function ProfileLink({ image, name }: ProfileLinkProps) {
  return (
    <Container>
      <Link href="/profil" passHref>
        <Icon>
          <Avatar image={image} name={name} />
        </Icon>
      </Link>
      <Menu>
        <ul>
          <Link href="/profil/list">
            <a>
              <li>Merkliste</li>
            </a>
          </Link>

          <Link href="/profil">
            <a>
              <li>Bewertungen</li>
            </a>
          </Link>

          <Link href="/profil/reviews">
            <a>
              <li>Reviews</li>
            </a>
          </Link>

          <Link href="/profil/account">
            <a>
              <li>Account</li>
            </a>
          </Link>
        </ul>
      </Menu>
    </Container>
  );
}

const Icon = styled.a`
  display: block;
  border-radius: 50%;
`;

const Menu = styled.div`
  --border-radius: 8px;

  position: absolute;
  display: none;
  background-color: ${colors.black};
  width: auto;
  right: 0;
  border-radius: var(--border-radius);

  ul {
    list-style: none;

    a {
      display: block;
      &:hover {
        background-color: gray;
      }

      &:first-of-type {
        border-top-right-radius: var(--border-radius);
        border-top-left-radius: var(--border-radius);
      }

      &:last-of-type {
        border-bottom-right-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
    }

    li {
      padding: 1em 2em;
    }
  }
`;

const Container = styled.div`
  position: relative;

  &:hover {
    ${Menu} {
      display: block;
    }
  }
`;

export default ProfileLink;
