import { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import Main from '@/layout/Main';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <Header />
      <Main className="flex-1 ">{children}</Main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
