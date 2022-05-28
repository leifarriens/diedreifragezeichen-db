import '../styles/global.css';
import '../styles/nprogress.css';
import '../styles/App.scss';

import Head from 'next/head';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from '@/components/Layout';

import { GlobalProvider } from '../context/GlobalContext';

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

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GlobalProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
