import App from 'next/app';
import Router from 'next/router'
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress'; //nprogress module
// import 'nprogress/nprogress.css'; //styles of nprogress
import '../styles/nprogress.css'

import '../styles/App.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { Provider } from 'next-auth/client';
import { GlobalProvider } from '../context/GlobalContext';

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps, folgen }) {
  return (
    <>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="shortcut icon" type="img/png" href="/icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'de_DE',
          // url: 'https://www.factory-shop.de/',
          site_name: 'Die drei Fragezeichen DB',
        }}
        defaultTitle="Drei Fragezeichen DB"
      />

      <Provider session={pageProps.session}>
        <GlobalProvider>
          <div className="container">
            <Header />
            <div className="main">
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
        </GlobalProvider>
      </Provider>
    </>
  );
}

export default MyApp;
