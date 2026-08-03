import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FiLogIn, FiStar } from 'react-icons/fi';

import { parseQueryParam } from '@/common/utils';
import { Button } from '@/components/shared';
import { breakpoints } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { useBreakpoint } from '@/hooks';
import { useGridState } from '@/modules/Grid';

import LogoImg from '../../../../public/logo.png';
import { MerklistButton } from './MerklistButton';
import { ProfileLink } from './ProfileLink';
import { Search } from './Search';
import { Container, HomeLink } from './StyledHeader';

export function Header() {
  const { setSearchQuery } = useGridState();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isDesktop = useBreakpoint(parseInt(breakpoints.mobileHeader));
  const refFolgeId = parseQueryParam(router.query.id);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setSearchQuery('');

    if (router.route === '/') {
      if (router.query.ref ?? router.query.search) {
        await router.replace('/', '/', { shallow: true }); // removes url query params
      }

      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (router.query.id) {
      return router.push(`/?ref=${refFolgeId}`);
    }

    return router.push('/');
  };

  return (
    <div className="sticky top-0 z-50 w-full sm:px-8 sm:py-8">
      <Container
        className={classNames(
          'bg-ddfDarkblue flex items-center justify-between gap-4 px-6 py-8 transition-all duration-300 sm:rounded-xl sm:bg-transparent sm:px-12 sm:py-6',
          {
            'sm:bg-ddfLightblue/10! shadow-lg sm:backdrop-blur-lg': isScrolled,
          },
        )}
      >
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
            className="animate-fadein flex shrink-0 grow basis-auto items-center justify-end"
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
                {isDesktop ? 'Anmelden' : <FiLogIn size={18} />}
              </Button>
            ) : (
              <>
                <div className="mr-4 hidden gap-2 lg:flex">
                  <Link href="/profil" legacyBehavior passHref>
                    <Button as="a" ghost>
                      <FiStar size={18} />
                      Bewertungen
                    </Button>
                  </Link>
                  <MerklistButton />
                </div>

                <ProfileLink user={session.user} />
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
