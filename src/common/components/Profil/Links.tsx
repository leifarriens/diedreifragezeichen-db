import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { colors } from '@/constants/theme';
import Wrapper from '@/layout/Wrapper';

function Links() {
  const { pathname } = useRouter();

  return (
    <StyledLinks>
      <LinkWrapper maxWidth="1280px">
        <Link
          href="/profil"
          className={classnames({ active: pathname == '/profil' })}
        >
          Bewertungen
        </Link>

        <Link
          href="/profil/list"
          className={classnames({ active: pathname == '/profil/list' })}
        >
          Merkliste
        </Link>

        <Link
          href="/profil/account"
          className={classnames({ active: pathname == '/profil/account' })}
        >
          Account
        </Link>
      </LinkWrapper>
    </StyledLinks>
  );
}

const StyledLinks = styled.div`
  font-size: 1.65em;
  /* margin-top: 1em; */
  margin-bottom: 1em;
  background-color: #000408;
  padding: 1em 0;

  a {
    border-bottom: 4px solid transparent;

    &:hover,
    &.active {
      border-bottom-color: ${colors.lightblue};
    }
  }
`;

const LinkWrapper = styled(Wrapper)`
  display: flex;
  justify-content: space-around;
`;

export default Links;
