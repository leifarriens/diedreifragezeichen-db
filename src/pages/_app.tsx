import '@/styles/global.scss';
import '@/styles/nprogress.css';

import { AppProps } from 'next/app';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress';
import { QueryClient, QueryClientProvider } from 'react-query';

import { GlobalProvider } from '@/context/GlobalContext';
import Page from '@/layout/Page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
      />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <GlobalProvider>
            <Page>
              <Component {...pageProps} />
            </Page>
          </GlobalProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
