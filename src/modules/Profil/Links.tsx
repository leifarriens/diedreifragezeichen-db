import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Wrapper } from '@/layout';

export function Links() {
  return (
    <div className="mb-4 bg-black py-6 text-2xl">
      <Wrapper
        maxWidth="1280px"
        className="grid grid-cols-3 justify-items-center"
      >
        <ProfileTabLink path="" label="Bewertungen" />
        <ProfileTabLink path="/list" label="Merkliste" />
        <ProfileTabLink path="/account" label="Account" />
      </Wrapper>
    </div>
  );
}

interface ProfileTabLinkProps {
  path: string;
  label: string;
}

function ProfileTabLink({ path, label }: ProfileTabLinkProps) {
  const { pathname } = useRouter();
  const href = `/profil${path}`;

  return (
    <Link
      href={href}
      className={classnames(
        'border-b-4 border-transparent hover:border-b-ddfLightblue',
        {
          'border-b-ddfLightblue': pathname === href,
        },
      )}
    >
      {label}
    </Link>
  );
}
