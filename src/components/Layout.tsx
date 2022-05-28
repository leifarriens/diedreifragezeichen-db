import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <main className="main">{children}</main>
      <Footer />
      <ScrollToTop />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </div>
  );
}
