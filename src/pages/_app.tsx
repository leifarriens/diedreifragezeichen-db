import '@/styles/global.scss';
import '@/styles/nprogress.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress';

import { Page } from '@/layout';
import { Toaster } from '@/lib/Toaster';
import { GridProvider } from '@/modules/Grid';
import { trpc } from '@/utils/trpc';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'de_DE',
          url: 'https://diedreifragezeichen-db.de',
          site_name: 'Die drei Fragezeichen DB',
        }}
        defaultTitle="Drei Fragezeichen DB"
        titleTemplate="%s | Drei Fragezeichen DB"
        description="Die drei Fragezeichen Folgen Archiv und Bewertungen"
      />
      <SessionProvider session={pageProps.session}>
        <GridProvider>
          <Page>
            <Component {...pageProps} />
          </Page>
        </GridProvider>
      </SessionProvider>
      <Toaster />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </>
  );
};

export default trpc.withTRPC(MyApp);
