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
          <span className="w-min-5 absolute -top-1 -right-1 flex h-5 items-center justify-center rounded-full bg-ddfRed p-1 text-xs text-white">
            {data.length.toString()}
          </span>
        )}
      </Button>
    </Link>
  );
}
