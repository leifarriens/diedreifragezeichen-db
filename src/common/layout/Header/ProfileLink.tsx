import Link from 'next/link';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Avatar } from '@/common/components/shared';
import { colors } from '@/constants/theme';

interface ProfileLinkProps {
  user?: Session['user'];
}

export function ProfileLink({ user }: ProfileLinkProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (e.target instanceof HTMLElement && !ref.current?.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <Container ref={ref}>
      <button type="button" onClick={() => setIsMenuOpen((curr) => !curr)}>
        <Avatar url={user?.image} />
      </button>

      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li>
              <Link href="/profil" onClick={handleLinkClick}>
                Bewertungen
              </Link>
            </li>
            <li>
              <Link href="/profil/list" onClick={handleLinkClick}>
                Merkliste
              </Link>
            </li>
            <li>
              <Link href="/profil/account" onClick={handleLinkClick}>
                Account
              </Link>
            </li>
            {user?.role === 'Admin' && (
              <li>
                <Link href="/admin/folgen" onClick={handleLinkClick}>
                  Admin
                </Link>
              </li>
            )}
            <hr />
            <li>
              <button type="button" onClick={() => signOut()}>
                Abmelden
              </button>
            </li>
          </ul>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  --item-padding: 0.75em 1em;
  position: relative;

  button {
    font-size: 1em;
    padding: 0;
    display: flex;
    border-radius: 50%;
  }

  .menu {
    position: absolute;
    right: 0;
    background-color: black;
    border-radius: 8px;

    hr {
      border-color: ${colors.gray};
    }

    ul {
      list-style: none;

      a {
        display: block;
        padding: var(--item-padding);
      }

      li {
        width: 100%;

        &:hover {
          background-color: #333;
        }

        &:first-of-type {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        &:last-of-type {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }

      button {
        display: block;
        font-size: inherit;
        width: 100%;
        text-align: left;
        border-radius: 0;
        padding: var(--item-padding);
      }
    }
  }
`;
