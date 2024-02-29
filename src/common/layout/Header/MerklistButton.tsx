import Link from 'next/link';

import { Button } from '@/components/shared';
import { useUserList } from '@/hooks';

export function MerklistButton() {
  const { data } = useUserList();

  return (
    <Link href="/profil/list" legacyBehavior passHref>
      <Button as="a" ghost className="relative">
        Merkliste
        {data && data.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ddfRed p-1 text-xs text-white">
            {data.length.toString()}
          </span>
        )}
      </Button>
    </Link>
  );
}
