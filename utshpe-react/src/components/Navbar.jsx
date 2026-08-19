import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="nav">
      <Link className="brand" to="/">
        <img
          src="../assets/images/navbar_logo.png"
          alt="UT SHPE"
        />
      </Link>

      <button
        className="menu-toggle"
        aria-expanded="false"
        aria-controls="site-menu"
        aria-label="Open menu"
      >
        
      </button>

      <nav className="menu" id="site-menu" role="navigation">
        <Link to="/about" className="nav-link">
          About Us
        </Link>

        <Link to="/leadership" className="nav-link">
          Leadership
        </Link>

        <Link to="/sponsorship" className="nav-link">
          Sponsorship
        </Link>

        <Link to="/shpetinas" className="nav-link shpetinas">
          SHPEtinas
        </Link>

        <Link to="/membership" className="nav-link">
          Membership
        </Link>

        <Link to="/resources" className="nav-link">
          Resources
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;