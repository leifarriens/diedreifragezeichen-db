import type { ReactNode } from 'react';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from './Main';
import { ScrollToTop } from './ScrollToTop';

interface LayoutProps {
  children: ReactNode | ReactNode[];
}

export function Page({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main className="flex-1">{children}</Main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
