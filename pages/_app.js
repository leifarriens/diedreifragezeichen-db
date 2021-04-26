import Head from 'next/head'
// import { DefaultSeo } from 'next-seo';

import '../styles/App.scss';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

function MyApp({ Component, pageProps, menu }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="img/png" href="/icon.png"/>
        {/* <link rel="stylesheet" href="https://contentcrawler.de/lgr-design/lgr-design.css"/> */}
      </Head>
      {/* <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'de_DE',
          url: 'https://www.factory-shop.de/',
          site_name: 'Hemingway Factory Shop',
        }}
        defaultTitle = 'Hemingway Factory Shop'
      /> */}
      MOIn
      {/* <Header /> */}
      {/* <Component {...pageProps} /> */}
      {/* <Footer menu={menu} /> */}
    </>
  )
}

// MyApp.getInitialProps = async () => {
//   // const res = await fetch(`http://localhost:5000/v0/warengruppen/?webshopgruppe=hkg1`);
//   // const menu = await res.json();
//   // return { menu };
// }

export default MyApp