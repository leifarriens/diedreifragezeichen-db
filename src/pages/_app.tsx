import '@/styles/global.scss';
import '@/styles/nprogress.css';

import { AppProps } from 'next/app';
import Router from 'next/router';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Page from '@/layout/Page';
import { queryClient } from '@/lib/query';
import { GridProvider } from '@/modules/Grid';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
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
        titleTemplate="Drei Fragezeichen DB | %s"
        description="Die drei Fragezeichen Folgen Archiv und Bewertungen"
      />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <GridProvider>
            <Page>
              <Component {...pageProps} />
            </Page>
          </GridProvider>
        </SessionProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
