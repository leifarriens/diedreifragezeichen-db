import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';

import Main from './Main';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <Header />
      <Main>{children}</Main>
      <Footer />
      <ScrollToTop />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </div>
  );
}