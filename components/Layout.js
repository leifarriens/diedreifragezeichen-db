import Footer from './Footer/';
import ScrollToTop from './ScrollToTop';

function Layout({ children }) {
  return (
    <div className="container">
      <main className="main">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Layout;
