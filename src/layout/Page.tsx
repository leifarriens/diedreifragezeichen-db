import { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import ScrollToTop from './ScrollToTop';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="page-container">
      <Header />
      <Main className="flex-1 ">{children}</Main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
