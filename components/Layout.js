import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="container">
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
