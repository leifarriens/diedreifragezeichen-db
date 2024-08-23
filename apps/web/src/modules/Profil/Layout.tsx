import type { ReactNode } from 'react';

import { Wrapper } from '@/layout';

import { Links } from './Links';

interface ProfileLayoutProps {
  children: ReactNode | ReactNode[];
}

export function ProfilLayout({ children }: ProfileLayoutProps) {
  return (
    <div>
      <Links />
      <Wrapper maxWidth="1280px">{children}</Wrapper>
    </div>
  );
}
