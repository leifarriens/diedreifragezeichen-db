import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';

import { parseQueryParam } from '@/common/utils';
import { colors } from '@/constants/theme';
import { Wrapper } from '@/layout';

export function BackButton() {
  const router = useRouter();
  const folgeId = parseQueryParam(router.query.id);

  return (
    <Wrapper className="mt-8">
      <button
        type="button"
        aria-label="Zurück"
        onClick={() => router.push(`/?ref=${folgeId}`)}
      >
        <IoMdArrowBack size={28} color={colors.white} />
      </button>
    </Wrapper>
  );
}
