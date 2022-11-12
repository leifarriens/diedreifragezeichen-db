/* eslint-disable @next/next/no-img-element */
import classnames from 'classnames';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { colors } from '@/constants/theme';

type ProfileLinkProps = {
  image: string | null | undefined;
};

function ProfileLink({ image }: ProfileLinkProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const src = !image ? '/white_small.png' : image;
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
      <AvatarButton
        type="button"
        onClick={() => setIsMenuOpen((curr) => !curr)}
      >
        <Avatar
          src={src}
          referrerPolicy="no-referrer"
          className={classnames({ placeholder: !image })}
          alt=""
        />
      </AvatarButton>

      {isMenuOpen && (
        <div className="menu">
          <ul>
            <Link href="/profil" onClick={handleLinkClick}>
              <li>Bewertungen</li>
            </Link>
            <Link href="/profil/list" onClick={handleLinkClick}>
              <li>Merkliste</li>
            </Link>
            <Link href="/profil/account" onClick={handleLinkClick}>
              <li>Account</li>
            </Link>
            <hr />
            <button type="button" onClick={handleLinkClick}>
              <li>Abmelden</li>
            </button>
          </ul>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
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

    ul {
      list-style: none;

      a {
        display: block;
      }

      li {
        width: 100%;
      }

      button {
        display: block;
        font-size: inherit;
        width: 100%;
        text-align: left;
        border-radius: 0;
      }

      li {
        padding: 1em;

        &:hover {
          background-color: #333;
        }
      }
    }
  }
`;

const AvatarButton = styled.button`
  font-size: 1em;
  padding: 0;
  display: flex;
  border-radius: 50%;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 2.6em;
  height: 2.6em;
  object-fit: cover;
  box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 50%);

  &.placeholder {
    object-fit: contain;
    padding: 0.5em;
    background-color: ${colors.gray};
  }
`;

export default ProfileLink;
