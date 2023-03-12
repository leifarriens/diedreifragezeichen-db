import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Headroom from 'react-headroom';
import { AiOutlineClose } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';

import { useBreakpoint } from '@/common/hooks/useBreakpoint';
import Button from '@/components/shared/Button';
import { breakpoints } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { useGridState } from '@/modules/Grid';

import LogoImg from '../../../public/logo.png';
import ProfileLink from './ProfileLink';
import Search from './Search';
import { Container, HomeLink } from './StyledHeader';

const Header = () => {
  const { setSearchQuery } = useGridState();
  const { data: session, status } = useSession();
  const router = useRouter();
  const desktop = useBreakpoint(parseInt(breakpoints.mobileHeader));

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
          <Image
            src={LogoImg}
            className="h-full w-auto object-contain"
            alt="Logo"
          />
        </HomeLink>

        <Search />

        {status !== 'loading' && (
          <div
            // eslint-disable-next-line no-inline-styles/no-inline-styles
            style={{ gridArea: 'profile' }}
            className="flex flex-shrink-0 flex-grow basis-auto animate-fadein items-center justify-end"
          >
            {router.pathname === '/signin' ? (
              <button
                type="button"
                className="hover:opacity-80"
                onClick={router.back}
              >
                <AiOutlineClose size={28} />
              </button>
            ) : !session ? (
              <Button
                aria-label="Anmelden"
                color={colors.red}
                onClick={() => signIn()}
              >
                {desktop ? 'Anmelden' : <FiLogIn size={18} />}
              </Button>
            ) : (
              <>
                <div className="mr-4 hidden gap-2 lg:flex">
                  <Link href="/profil" legacyBehavior passHref>
                    <Button as="a" ghost>
                      Bewertungen
                    </Button>
                  </Link>
                  <Link href="/profil/list" legacyBehavior passHref>
                    <Button as="a" ghost>
                      Merkliste
                    </Button>
                  </Link>
                </div>

                <ProfileLink user={session.user} />
              </>
            )}
          </div>
        )}
      </Container>
    </Headroom>
  );
};

export default Header;
