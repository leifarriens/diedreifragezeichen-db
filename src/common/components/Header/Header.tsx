import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Headroom from 'react-headroom';
import { AiOutlineClose } from 'react-icons/ai';

import Button from '@/components/shared/Button';
import { colors } from '@/constants/theme';
import { useGridState } from '@/modules/Grid';

import LogoImg from '../../../../public/logo.png';
import ProfileLink from '../ProfileLink';
import Search from './Search';
import { CloseLoginButton, Container, HomeLink } from './StyledHeader';

const Header = () => {
  const { setSearchQuery } = useGridState();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

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
    <Headroom>
      <Container>
        <HomeLink href="/" onClick={handleHomeClick}>
          <Image src={LogoImg} alt="Logo" />
        </HomeLink>

        <Search />

        {!loading && router.pathname !== '/signin' && (
          <div className="right">
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
            ) : (
              <ProfileLink image={session.user.image} />
            )}
          </div>
        )}
        {router.pathname === '/signin' && (
          <div className="right">
            <CloseLoginButton onClick={router.back}>
              <AiOutlineClose size={28} />
            </CloseLoginButton>
          </div>
        )}
      </Container>
    </Headroom>
  );
};

export default Header;
