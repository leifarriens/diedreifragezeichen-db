import { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <Header />
      <main className="flex-1 grid place-items-center items-center justify-items-center">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
