import Head from 'next/head'
import { DefaultSeo } from 'next-seo';

import '../styles/App.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { Provider } from 'next-auth/client'
import { GlobalProvider } from '../context/GlobalContext'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="img/png" href="/icon.png" />
        {/* <link rel="stylesheet" href="https://contentcrawler.de/lgr-design/lgr-design.css"/> */}
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
        defaultTitle = 'Drei Fragezeichen DB'
      />
      <Provider session={pageProps.session}>
        <GlobalProvider>
          <Header />
          <Component {...pageProps} />

          <Footer />
        </GlobalProvider>
      </Provider>
    </>
  )
}

export default MyApp
