import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

function Links() {
  const { pathname } = useRouter();

  return (
    <StyledLinks>
      <Link href="/profil">
        <a className={classnames({ active: pathname == '/profil' })}>
          Bewertungen
        </a>
      </Link>

      <Link href="/profil/list">
        <a className={classnames({ active: pathname == '/profil/list' })}>
          Merkliste
        </a>
      </Link>
    </StyledLinks>
  );
}

const StyledLinks = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 2em;
  margin-bottom: 1em;

  a {
    border-bottom: 4px solid transparent;

    &:hover,
    &.active {
      border-bottom-color: ${colors.lightblue};
    }
  }
`;

export default Links;
