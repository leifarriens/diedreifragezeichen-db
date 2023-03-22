import type { NextPage } from 'next';

import { Wrapper } from '@/layout';

const InternalServerError: NextPage = () => {
  return (
    <Wrapper>
      <h1>Server Fehler beim Laden der Seite</h1>
    </Wrapper>
  );
};

export default InternalServerError;
