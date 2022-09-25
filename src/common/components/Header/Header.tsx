import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import Headroom from 'react-headroom';
import { AiOutlineClose } from 'react-icons/ai';

import Button from '@/components/shared/Button';
import { breakpoints } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { useGlobalState } from '@/context/GlobalContext';
import { useWindowSize } from '@/hooks';

import LogoImg from '../../../../public/logo.png';
import Search from './Search';
import {
  CloseLoginButton,
  Container,
  HomeLink,
  ProfileLink,
} from './StyledHeader';

const Header = () => {
  const { setSearchQuery } = useGlobalState();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  const { width } = useWindowSize();

  const handleHomeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setSearchQuery('');

    if (router.route === '/') {
      if (router.query.ref) {
        router.replace('/', '/', { shallow: true }); // removes url query params
      }

      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (router.query.id) {
      return router.push(`/?ref=${router.query.id}`);
    }

    return router.push('/');
  };

  return (
    <Headroom disable={width > parseFloat(breakpoints.mobileHeader)}>
      <Container>
        <HomeLink href="/" onClick={handleHomeClick}>
          <Image src={LogoImg} alt="Logo" />
        </HomeLink>

        <Search />

        {!loading && router.pathname !== '/signin' && (
          <ProfileLink>
            {!session ? (
              <span>
                <Button
                  aria-label="Anmelden"
                  color={colors.red}
                  onClick={() => signIn()}
                >
                  Anmelden
                </Button>
              </span>
            ) : router.pathname.match('/profil') ? (
              <span>
                <Button
                  aria-label="Ausloggen"
                  ghost={true}
                  color={colors.red}
                  onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                >
                  Abmelden
                </Button>
              </span>
            ) : (
              <div>
                <Link href="/profil" passHref>
                  <Button as="a" color={colors.lightblue}>
                    Profil
                  </Button>
                </Link>
              </div>
            )}
          </ProfileLink>
        )}
        {router.pathname === '/signin' && (
          <ProfileLink>
            <CloseLoginButton onClick={router.back}>
              <AiOutlineClose size={28} />
            </CloseLoginButton>
          </ProfileLink>
        )}
      </Container>
    </Headroom>
  );
};

export default Header;
