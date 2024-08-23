import type { NextPage } from 'next';

import { Wrapper } from '@/layout';

const NotFound: NextPage = () => {
  return (
    <Wrapper className="flex items-center justify-center">
      <h1 className="text-4xl font-bold">Nichts im Archiv</h1>
    </Wrapper>
  );
};

export default NotFound;
