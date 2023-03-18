import Link from 'next/link';

import Button from '@/common/components/shared/Button';
import { useUserList } from '@/common/hooks/useUserList';

export function MerklistButton() {
  const { data } = useUserList();

  return (
    <Link href="/profil/list" legacyBehavior passHref>
      <Button as="a" ghost className="relative">
        Merkliste
        {data && data.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ddfRed text-sm text-white">
            {data.length.toString()}
          </span>
        )}
      </Button>
    </Link>
  );
}
