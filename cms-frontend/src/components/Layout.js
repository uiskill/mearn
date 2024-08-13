import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ navbar = true, children }) => {
  return (
    <>
      {navbar && <Navbar />}
      <div className="container mt-3">{children}</div>
      <Footer/>
      
    </>
  );
};

export default Layout;
