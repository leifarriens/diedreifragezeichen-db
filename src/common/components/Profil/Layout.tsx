import type { ReactNode } from 'react';

import Wrapper from '@/layout/Wrapper';

import Links from './Links';

type ProfileLayoutProps = {
  children: ReactNode | ReactNode[];
};

function ProfilLayout({ children }: ProfileLayoutProps) {
  return (
    <div>
      <Links />
      <Wrapper maxWidth="1280px">{children}</Wrapper>
    </div>
  );
}

export default ProfilLayout;
