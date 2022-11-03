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
      <Wrapper maxWidth="1280px">
        <nav>
          <LinkList>
            <li>
              <Link href="/profil/list">
                <a
                  className={classnames({ active: pathname == '/profil/list' })}
                >
                  Merkliste
                </a>
              </Link>
            </li>

            <li>
              <Link href="/profil">
                <a className={classnames({ active: pathname == '/profil' })}>
                  Bewertungen
                </a>
              </Link>
            </li>

            <li>
              <Link href="/profil/reviews">
                <a
                  className={classnames({
                    active: pathname == '/profil/reviews',
                  })}
                >
                  Reviews
                </a>
              </Link>
            </li>

            <li>
              <Link href="/profil/account">
                <a
                  className={classnames({
                    active: pathname == '/profil/account',
                  })}
                >
                  Account
                </a>
              </Link>
            </li>
          </LinkList>
        </nav>
      </Wrapper>
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

const LinkList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
`;

export default Links;
